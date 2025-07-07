'use client'

import { useEffect, useState } from 'react'
import HomeEventTable from './home-event-table'
import { Events } from '@/types/event'
import { usePersistedDateRange } from '@/lib/hooks/use-presisted-date-range'
import { fetchEventWithCache } from '@/lib/api/vsda/get-event-with-chace'
import { SelectEvent } from '@/app/event/select-event'

function formatDateToDDMM(date: Date | undefined): string {
    if (!date) return ''
    const d = date.getDate().toString().padStart(2, '0')
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${d}/${m}`
}

const HomeEventPage = () => {
    const [data, setData] = useState<Events[]>([])
    const [isClient, setIsClient] = useState(false)
    const { startDate, endDate, setStartDate, setEndDate } =
        usePersistedDateRange(new Date('2025-06-30'), new Date('2025-07-05'))
    const [loading, setLoading] = useState<boolean>(true)
    const [showFromLast, setShowFromLast] = useState<boolean>(false)

    const [eventName, setEventName] = useState<string | null>(() => {
        // Ambil dari localStorage saat inisialisasi
        if (typeof window !== 'undefined') {
            return localStorage.getItem('eventName')
        }
        return null
    })

    useEffect(() => {
        const getDataEvent = async () => {
            if (!startDate || !endDate || !eventName) return

            try {
                setLoading(true)

                const formattedStart = formatDateToDDMM(startDate)
                const formattedEnd = formatDateToDDMM(endDate)

                const vsda = await fetchEventWithCache(
                    formattedStart,
                    formattedEnd,
                    eventName
                )

                setData(vsda)
            } catch (err) {
                console.error('❌ Fetch error:', err)
                alert('Gagal mengambil data VSDA Event')
            } finally {
                setLoading(false)
            }
        }

        getDataEvent()
    }, [startDate, endDate, eventName])

    useEffect(() => {
        setIsClient(true)
    }, [])
    return (
        <>
            <div className="rounded-md border border-border bg-card/50 p-6">
                <div className="flex justify-between">
                    {isClient && (
                        <SelectEvent
                            eventName={eventName}
                            setEventName={setEventName}
                        />
                    )}
                </div>
                <HomeEventTable
                    data={data}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    showFromLast={showFromLast}
                    setShowFromLast={setShowFromLast}
                />
            </div>
        </>
    )
}

export default HomeEventPage
