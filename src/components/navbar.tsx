'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'

const Navbar = () => {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

    useEffect(() => {
        const status = localStorage.getItem('isLoggedIn')
        setIsLoggedIn(status === 'true')
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('username')
        localStorage.clear()
        setIsLoggedIn(false)
        router.push('/login')
    }
    if (isLoggedIn === null) return null // loading state bisa ditambahkan jika perlu

    return (
        <>
            <div className="flex items-center gap-10">
                {isLoggedIn && (
                    <NavigationMenu className="hidden md:block">
                        <NavigationMenuList className="flex gap-4">
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/member">Member</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/vs-da">VS DA</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/event">Event</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                )}

                {isLoggedIn ? (
                    <Button
                        size="default"
                        variant="outline"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                ) : (
                    <Button size="default" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                )}
            </div>
        </>
    )
}

export default Navbar
