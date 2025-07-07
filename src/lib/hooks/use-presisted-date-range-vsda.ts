'use client'

import { useEffect, useState } from 'react'

// ⬅️ Ganti key lokal agar tidak tabrakan dengan hook event
const LOCAL_KEY_START_VSDA = 'vsda_start_date'
const LOCAL_KEY_END_VSDA = 'vsda_end_date'

export function usePersistedDateRangeVSDA(
    defaultStart?: Date,
    defaultEnd?: Date
) {
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    // Load data dari localStorage hanya sekali saat mount
    useEffect(() => {
        if (typeof window === 'undefined') return

        const storedStart = localStorage.getItem(LOCAL_KEY_START_VSDA)
        const storedEnd = localStorage.getItem(LOCAL_KEY_END_VSDA)

        setStartDate(
            storedStart ? new Date(storedStart) : (defaultStart ?? null)
        )
        setEndDate(storedEnd ? new Date(storedEnd) : (defaultEnd ?? null))
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined' && startDate) {
            localStorage.setItem(LOCAL_KEY_START_VSDA, startDate.toISOString())
        }
    }, [startDate])

    useEffect(() => {
        if (typeof window !== 'undefined' && endDate) {
            localStorage.setItem(LOCAL_KEY_END_VSDA, endDate.toISOString())
        }
    }, [endDate])

    return { startDate, endDate, setStartDate, setEndDate }
}
