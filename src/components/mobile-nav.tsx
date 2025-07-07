'use client'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
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

const MobileNav = () => {
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

    if (isLoggedIn === null) return null
    return (
        <Sheet>
            <SheetTrigger>
                <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
                <SheetHeader>
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <SheetDescription className="sr-only">
                        Mobile navigation menu
                    </SheetDescription>
                </SheetHeader>

                {/* Menu vertical */}
                <div className="mt-6 space-y-10 px-4">
                    {isLoggedIn && (
                        <NavigationMenu>
                            <NavigationMenuList className="flex flex-col items-start gap-2">
                                {[
                                    { href: '/member', label: 'Member' },
                                    { href: '/vs-da', label: 'VS DA' },
                                    { href: '/event', label: 'Event' }
                                ].map((item) => (
                                    <NavigationMenuItem key={item.href}>
                                        <NavigationMenuLink
                                            asChild
                                            className={navigationMenuTriggerStyle(
                                                {
                                                    className:
                                                        'w-full px-2 py-1.5 text-left'
                                                }
                                            )}
                                        >
                                            <Link href={item.href}>
                                                {item.label}
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
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
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav
