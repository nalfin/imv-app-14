'use client'

import { DialogCreateEvent } from './dialog-create-event'
import { SelectEvent } from './select-event'
import CardEvent from './card-event'
import { useEffect, useState } from 'react'
import { Events } from '@/types/event'
import { fetchEventWithCache } from '@/lib/api/vsda/get-event-with-chace'
import EventTable from './event-table'
import { usePersistedDateRange } from '@/lib/hooks/use-presisted-date-range'
import { FullScreenLoader } from '@/components/fullscreen-loader'
import { getEventSummary } from '@/utils/get-event-summary'
import { useAuthRedirect } from '@/lib/api/auth-redirect'
import LayoutPages from '@/components/layout-pages'

function formatDateToDDMM(date: Date | undefined): string {
    if (!date) return ''
    const d = date.getDate().toString().padStart(2, '0')
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${d}/${m}`
}

const EventPage = () => {
    const checked = useAuthRedirect() // ✅ Cek login
    const [data, setData] = useState<Events[]>([])
    const [isClient, setIsClient] = useState(false)

    const { startDate, endDate, setStartDate, setEndDate } =
        usePersistedDateRange(new Date('2025-06-30'), new Date('2025-07-05'))

    const [eventName, setEventName] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('eventName')
        }
        return null
    })

    const [loading, setLoading] = useState<boolean>(true)
    const [showFromLast, setShowFromLast] = useState<boolean>(false)

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

    const summary = getEventSummary(data)

    // ⛔ Jangan render jika belum dicek auth
    if (!checked) return null

    return (
        <LayoutPages>
            {loading && <FullScreenLoader />}
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Dashboard Event</h1>
                <div className="flex justify-between">
                    {isClient && (
                        <SelectEvent
                            eventName={eventName}
                            setEventName={setEventName}
                        />
                    )}
                    <DialogCreateEvent />
                </div>
                <CardEvent summary={summary} />
                <EventTable
                    data={data}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    showFromLast={showFromLast}
                    setShowFromLast={setShowFromLast}
                />
            </div>
        </LayoutPages>
    )
}

export default EventPage
