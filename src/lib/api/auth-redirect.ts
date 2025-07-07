'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export const useAuthRedirect = () => {
    const router = useRouter()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

        if (!isLoggedIn) {
            router.replace('/login')
        } else {
            setChecked(true)
        }
    }, [router])

    return checked // untuk mencegah flicker, kita render konten hanya saat sudah dicek
}
