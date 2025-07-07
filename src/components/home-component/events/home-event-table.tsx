'use client'

import { Events } from '@/types/event'
import { DataTable } from './home-data-table'
import { getColumnsFromDateRange } from './home-columns'
import { useMemo } from 'react'

interface EventsTableProps {
    data: Events[]
    startDate: Date | null
    endDate: Date | null
    setStartDate: (date: Date | null) => void
    setEndDate: (date: Date | null) => void
    showFromLast: boolean
    setShowFromLast: (val: boolean) => void
}

const HomeEventTable = ({
    data,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    showFromLast,
    setShowFromLast
}: EventsTableProps) => {
    const columns = useMemo(() => {
        if (!startDate || !endDate) return []
        return getColumnsFromDateRange(startDate, endDate)
    }, [startDate, endDate])
    return (
        <>
            <div className="grid gap-6">
                {columns.length > 0 && (
                    <DataTable<Events, unknown>
                        columns={columns}
                        data={showFromLast ? [...data].reverse() : data}
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        showFromLast={showFromLast}
                        setShowFromLast={setShowFromLast}
                    />
                )}
            </div>
        </>
    )
}

export default HomeEventTable
