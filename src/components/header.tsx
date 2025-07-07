import { usePathname } from 'next/navigation'
import MobileNav from './mobile-nav'
import NavLogo from './nav-logo'
import Navbar from './navbar'

const Header = () => {
    return (
        <>
            <header className="border-border mb-8 border-b">
                <div className="flex h-20 items-center justify-between">
                    <NavLogo />
                    <div className="hidden lg:block">
                        <Navbar />
                    </div>
                    <div className="md:hidden">
                        <MobileNav />
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
