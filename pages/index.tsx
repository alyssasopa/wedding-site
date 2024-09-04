import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import 'radar-sdk-js/dist/radar.css';
import styles from '../styles/Home.module.css'
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import Radar from 'radar-sdk-js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBuilding } from "@fortawesome/free-solid-svg-icons";
import trees from '../public/pine-trees.png';

const inter = Inter({ subsets: ['latin'] })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
const db = getFirestore();


function InputForm() {
  const [isSubmitted, setSubmitted] = useState(false);

  async function onSubmit(e: any) {
    e.preventDefault();

    const fullName = (document.getElementById('fullName') as HTMLInputElement).value;
    const address = (document.getElementById('address') as HTMLInputElement).value;
    const aptNumber = (document.getElementById('aptNumber') as HTMLInputElement).value;
    const form = document.getElementById('inputForm');
    const formDiv = document.getElementById('formDiv');

    if (!address) {
      alert('Please fill out your address.');
      return;
    }

    const docId = fullName.toLowerCase().replace(/\s/g,'');
    const docRef = doc(db, "guests", docId);
    const docSnap = await getDoc(docRef);

    // will write to DB if ID <firstNamelastName> does not exist or if
    // guest with existing ID approves overwrite of previous submission
    if (!docSnap.exists() || 
        confirm("You've already submitted your address as "
          .concat(docSnap.data().address)
          .concat(". Do you wish to overwrite with a new address?"))) {
      await setDoc(docRef, {
        fullName: fullName,
        address: address,
        aptNumber: aptNumber,
      });
      setSubmitted(true);
    } else {
      // clear value of hidden address field so user cannot resubmit
      // with what looks like a blank address input
      (document.getElementById('address') as HTMLInputElement).value = '';
      (form as HTMLFormElement).reset();
    }
  }

  return (
    <>
    {isSubmitted ? 
      (
        <>
          <Image className={styles.trees} src={trees} width="70" height="60" alt=""/>
          <div id="thanks" className={styles.caps} style={{textAlign: 'center'}}>
            thank you for your submission!
          </div>
        </>
      )
      :
      (
        <>
          <div className={styles.topSpace}>
            <div id="formAsk" className={styles.caps} style={{textAlign: 'center'}}>
              <i>please provide your name & address below</i>
            </div>
            <div id="formDiv">
              <form id="inputForm" className={styles.form} onSubmit={onSubmit}>
                <label htmlFor="fullName">full name:</label>
                <div className={styles.inputContainer}>
                  <FontAwesomeIcon icon={faUser} className={styles.inputIcon} style={{color: "#acbec8"}} />
                  <input type="text" id="fullName" name="fullName" className={styles.input} style={{ paddingLeft: '38px', paddingTop: '9px', paddingBottom: '9px' }} required/>
                </div>
                <label htmlFor="address">address:</label>
                <AddressInput/>
                <label htmlFor="aptNumber">apt #:</label>
                <div className={styles.inputContainer}>
                  <FontAwesomeIcon icon={faBuilding} className={styles.inputIcon} style={{color: "#acbec8"}} />
                  <input type="text" id="aptNumber" name="aptNumber" className={styles.input} style={{ paddingLeft: '38px', paddingTop: '9px', paddingBottom: '9px' }} placeholder='optional'/>
                </div>
                <br></br>
                <button type="submit" id="submit" value="submit" className={styles.button}><span>submit</span></button>
              </form>
            </div>
          </div>
        </>
      )
    }
    </>
  )
}

function AddressInput() {
  const autocompleteRef = useRef(null);

  useEffect(() => {
    Radar.initialize(process.env.NEXT_PUBLIC_RADAR_API_KEY);

    autocompleteRef.current = Radar.ui.autocomplete({
      container: 'autocomplete',
      placeholder: '',
      countryCode: 'US',
      layers: ['address'],
      onSelection: (address) => {
        (document.getElementById('address') as HTMLInputElement).value = address.formattedAddress;
      },
    });

    autocompleteRef
      .current
      ?.inputField
      .addEventListener("change", (e: Event) => { 
        (document.getElementById('address') as HTMLInputElement).value = 
          (e.currentTarget as HTMLInputElement).value;
      });

    return () => {
        autocompleteRef.current?.remove();
    };
  }, []);

  return (
    <div id="autocomplete">
      <input type="hidden" id="address" name="address" className={styles.input} required/>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Save the Date</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.title}>
            <div className={styles.header}>
              S A V E
            </div>
            <div className={styles.largeCursive}>
              the
            </div>
            <div className={styles.header}>
              D A T E
            </div>
          </div>

          <hr className={styles.hr}/>

          <div className={styles.alignRight}>
            <div className={styles.caps}>
              JONATHAN AND ALYSSA
              <br></br>
              july. 5. 2025
              <br></br>
              bellevue, wa
            </div>
          </div>

          <InputForm/>

          <div className={styles.alignRight}>
            <div className={styles.cursive}>
              invitation to follow
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
