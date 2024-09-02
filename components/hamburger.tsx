import Link from 'next/link'
import { slide as Menu } from 'react-burger-menu'

const HamburgerMenu = () => (<div>
    <Menu customBurgerIcon={<HamburgerIcon />} width={'auto'} className='left-0 top-12'>
        <Links />
    </Menu>
</div>)

const HamburgerIcon = () => (<div className='p-1/2'><svg className="w-8 h-8 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16"></path></svg></div>)

export const Links = () => (<>
    <Link href="/">Home</Link>
    <Link href="/about">About</Link>
</>)

export default HamburgerMenu