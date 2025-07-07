'use client'

import { useState, useMemo } from 'react'
import { VSDA } from '@/types/vsda'
import { getColumnsHomeVSDA } from './home-columns'
import { DataTable } from './home-data-table'

interface VSDATableProps {
    data: VSDA[]
    fetchData: () => void
    startDate: Date | null
    endDate: Date | null
    setStartDate: (date: Date | null) => void
    setEndDate: (date: Date | null) => void
    showFromLast: boolean
    setShowFromLast: (val: boolean) => void
    loading: boolean
}

export default function HomeVSDATable({
    data,
    fetchData,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    showFromLast,
    setShowFromLast,
    loading
}: VSDATableProps) {
    const [showDateHeader, setShowDateHeader] = useState<boolean>(false)

    const columns = useMemo(() => {
        if (!startDate || !endDate) return []
        return getColumnsHomeVSDA(startDate, endDate, showDateHeader)
    }, [startDate, endDate, showDateHeader])

    return (
        <div className="grid gap-6">
            {columns.length > 0 && (
                <DataTable<VSDA, unknown>
                    columns={columns}
                    data={showFromLast ? [...data].reverse() : data}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    showFromLast={showFromLast}
                    setShowFromLast={setShowFromLast}
                    showDateHeader={showDateHeader}
                    setShowDateHeader={setShowDateHeader}
                />
            )}
        </div>
    )
}
