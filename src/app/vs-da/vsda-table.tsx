'use client'

import { useState, useMemo } from 'react'
import { DataTable } from './data-table'
import { getColumnsFromDateRangeVSDA } from './columns'
import { VSDA } from '@/types/vsda'
import DialogEditVSDA from './dialog-edit'

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

export default function VSDATable({
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
    const [selectedVSDA, setSelectedVSDA] = useState<VSDA[]>([])
    const [editOpen, setEditOpen] = useState(false)
    const [showDateHeader, setShowDateHeader] = useState<boolean>(false)

    const handleEdit = (vsda: VSDA) => {
        setSelectedVSDA([vsda])
        setEditOpen(true)
    }

    const handleBulkEdit = (rows: VSDA[]) => {
        setSelectedVSDA(rows)
        setEditOpen(true)
    }

    const columns = useMemo(() => {
        if (!startDate || !endDate) return []
        return getColumnsFromDateRangeVSDA(
            handleEdit,
            startDate,
            endDate,
            showDateHeader
        )
    }, [startDate, endDate, showDateHeader])

    return (
        <div className="grid gap-6">
            {columns.length > 0 && (
                <DataTable<VSDA, unknown>
                    columns={columns}
                    data={showFromLast ? [...data].reverse() : data}
                    onSuccess={fetchData}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    showFromLast={showFromLast}
                    setShowFromLast={setShowFromLast}
                    showDateHeader={showDateHeader}
                    setShowDateHeader={setShowDateHeader}
                    onBulkEdit={handleBulkEdit}
                />
            )}

            {selectedVSDA.length > 0 && (
                <DialogEditVSDA
                    allDataVSDA={data}
                    selectedDataVSDA={selectedVSDA}
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    onSuccess={fetchData}
                />
            )}
        </div>
    )
}
