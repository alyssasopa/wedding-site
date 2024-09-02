import React, { useEffect, useRef } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import 'radar-sdk-js/dist/radar.css';
import styles from '../styles/Home.module.css'
import HamburgerMenu, { Links } from '../components/hamburger.tsx'
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import Radar from 'radar-sdk-js';

const inter = Inter({ subsets: ['latin'] })

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
const db = getFirestore();


function InputForm() {
  async function onSubmit(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;
    const form = document.getElementById('inputForm');

    const docId = firstName.concat(lastName);
    const docRef = doc(db, "guests", docId);
    const docSnap = await getDoc(docRef);

    // will write to DB if ID <firstNamelastName> does not exist or if
    // guest with existing ID approves overwrite of previous submission
    if (!docSnap.exists() || 
        confirm("You've already submitted your address as "
          .concat(docSnap.data().address)
          .concat(". Do you wish to overwrite with a new address?"))) {
      await setDoc(docRef, {
        firstName: firstName,
        lastName: lastName,
        address: address
      });
      var thanks = document.getElementById('thanks');
      if (thanks !== null) {
        thanks.outerHTML = '';
      }
      thanks = document.createElement('div');
      thanks.id = 'thanks';
      thanks.textContent = 'Thank you for your submission!';
      thanks.style.textAlign = "center";
      form.appendChild(thanks);
    }

    form.reset();
  }

  return (
    <>
      <div className={styles.topSpace}>
        <div className={styles.caps}>
          <i>please provide your name and address below</i>
        </div>
        <form id="inputForm" className={styles.form} onSubmit={onSubmit}>
          <label htmlFor="firstName">first name:</label>
          <input type="text" id="firstName" name="firstName" className={styles.input} required/>
          <label htmlFor="lastName">last name:</label>
          <input type="text" id="lastName" name="lastName" className={styles.input} required/>
          <label htmlFor="address">address:</label>
          <input type="hidden" id="address" name="address" className={styles.input} required/>
          <AddressInput/>
          <br></br>
          <button type="submit" id="submit" value="submit" className={styles.button}><span>submit</span></button>
        </form>
      </div>
    </>
  )
}

function AddressInput() {
  const autocompleteRef = useRef(null);

  useEffect(() => {
    Radar.initialize(process.env.RADAR_API_KEY);

    autocompleteRef.current = Radar.ui.autocomplete({
      container: 'autocomplete',
      placeholder: '',
      countryCode: 'US',
      onSelection: (address) => {
        document.getElementById('address').value = address.formattedAddress;
      },
    });

    return () => {
        autocompleteRef.current?.remove();
    };
  }, []);

  return (
    <div id="autocomplete"/>
  );
}

export default function Home() {
  return (
    <>
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
