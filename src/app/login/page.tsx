// 🎯 Versi yang Menghindari CORS dengan Content-Type: application/x-www-form-urlencoded

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { EyeIcon, EyeOff } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/loading-spinner'
import LayoutPages from '@/components/layout-pages'

const LoginPage = () => {
    const { push } = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [message, setMessage] = useState('')
    const [isSubmit, setIsSubmit] = useState(false)

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmit(true)
        setMessage('')

        const formBody = new URLSearchParams()
        formBody.append('username', username)
        formBody.append('password', password)

        try {
            const res = await fetch(`${baseURL}?action=login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody.toString()
            })

            const result = await res.json()

            if (result.success) {
                // ✅ Simpan status login
                localStorage.setItem('isLoggedIn', 'true')
                localStorage.setItem(
                    'username',
                    result.data?.username || username
                )

                push('/')
            } else {
                setMessage(result.message)
                setIsSubmit(false)
            }
        } catch (err) {
            setMessage('Terjadi kesalahan koneksi')
            setIsSubmit(false)
        }
    }

    const handleTogglePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setShowPassword(!showPassword)
    }

    return (
        <LayoutPages>
            <div className="flex h-screen flex-col items-center justify-center gap-8 px-4">
                <div className="flex justify-center">
                    <Link href="/">
                        <Image
                            src="/images/imv-logo.png"
                            alt="logo"
                            width={100}
                            height={1}
                            priority
                            className="w-auto"
                        />
                    </Link>
                </div>
                <form onSubmit={handleLogin}>
                    <Card className="w-full rounded-xl md:w-[400px]">
                        <CardHeader className="flex flex-col justify-center">
                            <CardTitle className="text-center text-2xl">
                                Sign in to an account
                            </CardTitle>
                            <CardDescription className="text-center">
                                Silahkan masukan username dan password
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex w-full flex-col gap-4">
                            {message && (
                                <p className="text-center text-sm text-yellow-500">
                                    {message}
                                </p>
                            )}
                            <div className="space-y-3">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    autoComplete="username"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        autoComplete="current-password"
                                    />
                                    <Button
                                        variant="link"
                                        className="absolute right-1 top-1/2 z-10 -translate-y-1/2 cursor-pointer px-2"
                                        onClick={handleTogglePassword}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4 text-muted-foreground" />
                                        ) : (
                                            <EyeIcon className="size-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                                {isSubmit ? (
                                    <div className="flex items-center space-x-1">
                                        <LoadingSpinner className="size-4" />
                                        <span>Login ...</span>
                                    </div>
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </LayoutPages>
    )
}

export default LoginPage
