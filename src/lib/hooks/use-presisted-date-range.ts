'use client'

import { useEffect, useState } from 'react'

const LOCAL_KEY_START = 'event_start_date'
const LOCAL_KEY_END = 'event_end_date'

export function usePersistedDateRange(defaultStart?: Date, defaultEnd?: Date) {
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    // Load data dari localStorage HANYA sekali saat mount
    useEffect(() => {
        if (typeof window === 'undefined') return

        const storedStart = localStorage.getItem(LOCAL_KEY_START)
        const storedEnd = localStorage.getItem(LOCAL_KEY_END)

        setStartDate(
            storedStart ? new Date(storedStart) : (defaultStart ?? null)
        )
        setEndDate(storedEnd ? new Date(storedEnd) : (defaultEnd ?? null))
        // ⛔️ JANGAN MASUKKAN defaultStart ke dependency!
    }, [defaultStart, defaultEnd]) // ✅ hanya dijalankan sekali saat komponen mount

    useEffect(() => {
        if (typeof window !== 'undefined' && startDate) {
            localStorage.setItem(LOCAL_KEY_START, startDate.toISOString())
        }
    }, [startDate])

    useEffect(() => {
        if (typeof window !== 'undefined' && endDate) {
            localStorage.setItem(LOCAL_KEY_END, endDate.toISOString())
        }
    }, [endDate])

    return { startDate, endDate, setStartDate, setEndDate }
}
