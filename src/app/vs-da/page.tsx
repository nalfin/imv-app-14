'use client'

import VSDATable from './vsda-table'
import { useCallback, useEffect, useState } from 'react'
import { VSDA } from '@/types/vsda'
import { fetchVSDAWithCache } from '@/lib/api/vsda/get-vsda-with-cache'
import { FullScreenLoader } from '@/components/fullscreen-loader'
import { usePersistedDateRangeVSDA } from '@/lib/hooks/use-presisted-date-range-vsda'
import { useAuthRedirect } from '@/lib/api/auth-redirect'
import LayoutPages from '@/components/layout-pages'

function formatDateToDDMM(date: Date | undefined): string {
    if (!date) return ''
    const d = date.getDate().toString().padStart(2, '0')
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${d}/${m}`
}

const VsDAPage = () => {
    const checked = useAuthRedirect() // ⬅️ Proteksi login

    const [data, setData] = useState<VSDA[]>([])
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

    const getDataVSDA = useCallback(async () => {
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
    }, [startDateVSDA, endDateVSDA])

    useEffect(() => {
        if (checked) {
            getDataVSDA()
        }
    }, [startDateVSDA, endDateVSDA, checked, getDataVSDA])

    // ⛔ Jangan render apapun sebelum auth dicek
    if (!checked) return null

    console.log(data)

    return (
        <LayoutPages>
            {loading && <FullScreenLoader />}
            <div className="space-y-3">
                <h1 className="text-2xl font-bold">Dashboard VS DA</h1>
                <VSDATable
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
        </LayoutPages>
    )
}

export default VsDAPage
