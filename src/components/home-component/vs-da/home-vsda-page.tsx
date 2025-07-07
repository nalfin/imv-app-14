'use client'

import { useEffect, useState } from 'react'
import { fetchVSDAWithCache } from '@/lib/api/vsda/get-vsda-with-cache'
import HomeVSDATable from './home-vsda-table'
import { VSDA } from '@/types/vsda'
import { usePersistedDateRangeVSDA } from '@/lib/hooks/use-presisted-date-range-vsda'

function formatDateToDDMM(date: Date | undefined): string {
    if (!date) return ''
    const d = date.getDate().toString().padStart(2, '0')
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${d}/${m}`
}

const HomeVSDAPage = () => {
    const [data, setData] = useState<VSDA[]>([])
    const [isClient, setIsClient] = useState(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [showFromLast, setShowFromLast] = useState<boolean>(false)

    const {
        startDate: startDateVSDA,
        endDate: endDateVSDA,
        setStartDate: setStartDateVSDA,
        setEndDate: setEndDateVSDA
    } = usePersistedDateRangeVSDA(
        new Date('2025-06-30'),
        new Date('2025-07-05')
    )

    const getDataVSDA = async () => {
        if (!startDateVSDA || !endDateVSDA) return

        try {
            setLoading(true)

            const formattedStart = formatDateToDDMM(startDateVSDA)
            const formattedEnd = formatDateToDDMM(endDateVSDA)

            const vsda = await fetchVSDAWithCache(formattedStart, formattedEnd)

            setData(vsda)
        } catch (err) {
            console.error('❌ Fetch error:', err)
            alert('Gagal mengambil data VSDA')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getDataVSDA()
    }, [startDateVSDA, endDateVSDA])

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <>
            <div className="bg-card/50 border-border rounded-md border p-6">
                <p className="flex h-9 items-center font-semibold">
                    PROGRESS POINT DA ALL MEMBER
                </p>
                <HomeVSDATable
                    data={data}
                    loading={loading}
                    startDate={startDateVSDA}
                    endDate={endDateVSDA}
                    setStartDate={setStartDateVSDA}
                    setEndDate={setEndDateVSDA}
                    showFromLast={showFromLast}
                    setShowFromLast={setShowFromLast}
                    fetchData={getDataVSDA}
                />
            </div>
        </>
    )
}

export default HomeVSDAPage
