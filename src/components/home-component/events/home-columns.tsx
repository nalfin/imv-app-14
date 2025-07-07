'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Events } from '@/types/event'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Format tanggal ke 'yyyy-mm-dd' untuk pencocokan
function formatToYYYYMMDD(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

// D1–D6 label mapping
function getDLabel(date: Date): string {
    const map: Record<number, string> = {
        1: 'D1',
        2: 'D2',
        3: 'D3',
        4: 'D4',
        5: 'D5',
        6: 'D6'
    }
    return map[date.getDay()] || ''
}

// Buat range tanggal dari start sampai end
function getDateRange(start: Date, end: Date): Date[] {
    const dates: Date[] = []
    const current = new Date(start)
    while (current <= end) {
        dates.push(new Date(current))
        current.setDate(current.getDate() + 1)
    }
    return dates
}

export function getColumnsFromDateRange(
    startDate: Date,
    endDate: Date
): ColumnDef<Events>[] {
    const dateList = getDateRange(startDate, endDate)

    const baseColumns: ColumnDef<Events>[] = [
        {
            accessorKey: 'name',
            id: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Member Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="ml-4">{row.getValue('name')}</div>
            ),
            minSize: 250
        },
        {
            accessorKey: 'hq',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    HQ
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const hq = row.getValue<number>('hq')
                const bg = hq === 27 ? 'bg-green-600 text-white' : ''
                return (
                    <div className={`ml-4 rounded px-2 py-1 text-center ${bg}`}>
                        {hq}
                    </div>
                )
            },
            size: 80,
            minSize: 80,
            maxSize: 80
        }
    ]

    const dynamicColumns: ColumnDef<Events>[] = dateList
        .filter((date) => date.getDay() !== 0)
        .map((date) => {
            const formattedDate = formatToYYYYMMDD(date)
            const label = getDLabel(date)

            return {
                id: `point-${formattedDate}`,
                header: label,
                size: 80,
                minSize: 80,
                cell: ({ row }) => {
                    const matched = row.original.data_point_da.find(
                        (item) => item.date === formattedDate
                    )
                    const raw = matched?.value || ''
                    const match = raw.match(/\d+/)
                    const number = match ? parseInt(match[0], 10) : null

                    const bgColor =
                        number === null
                            ? 'bg-transparent'
                            : number >= 7
                              ? 'bg-green-600'
                              : 'bg-red-700'

                    return (
                        <div
                            className={`${bgColor} w-full rounded px-2 py-1 text-center text-white`}
                        >
                            {raw || '-'}
                        </div>
                    )
                }
            }
        })

    const percentageColumn: ColumnDef<Events> = {
        id: 'percentage',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                %
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        accessorFn: (row) => {
            const formattedDates = dateList
                .filter((d) => d.getDay() !== 0)
                .map(formatToYYYYMMDD)

            const total = formattedDates.reduce((sum, date) => {
                const match = row.data_point_da.find((d) => d.date === date)
                const raw = match?.value || ''
                const num = raw.match(/\d+/)
                return sum + (num ? parseInt(num[0], 10) : 0)
            }, 0)

            const maxTotal = formattedDates.length * 9
            return Math.round((total / maxTotal) * 100)
        },
        size: 80,
        minSize: 80,
        maxSize: 80,
        cell: ({ getValue }) => {
            const percentage = getValue<number>()
            return <div className="ml-4 font-semibold">{percentage}%</div>
        }
    }

    const resultColumn: ColumnDef<Events> = {
        id: 'result',
        accessorFn: (row) => {
            const hq = row.hq
            const formattedDates = dateList
                .filter((d) => d.getDay() !== 0)
                .map(formatToYYYYMMDD)

            const lowPoints = formattedDates.filter((date) => {
                const match = row.data_point_da.find((d) => d.date === date)
                const raw = match?.value || ''
                const num = raw.match(/\d+/)
                const value = num ? parseInt(num[0], 10) : null
                return value !== null && value < 7
            })

            const lowCount = lowPoints.length

            if (hq === 27) {
                return lowCount > 4 ? 'UNQUALIFIED' : 'QUALIFIED'
            } else {
                return lowCount > 4 ? 'UNQUALIFIED' : 'ON PROGRESS...'
            }
        },
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Hasil
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        sortingFn: (rowA, rowB, columnId) => {
            const order = ['QUALIFIED', 'ON PROGRESS...', 'UNQUALIFIED']
            const a = rowA.getValue<string>(columnId)
            const b = rowB.getValue<string>(columnId)
            return order.indexOf(a) - order.indexOf(b)
        },
        size: 150,
        minSize: 120,
        maxSize: 200,
        cell: ({ getValue }) => {
            const result = getValue<string>()

            const bg =
                result === 'QUALIFIED'
                    ? 'bg-green-600'
                    : result === 'UNQUALIFIED'
                      ? 'bg-red-600'
                      : 'bg-stone-900'

            const textColor =
                result === 'QUALIFIED'
                    ? 'text-white'
                    : result === 'UNQUALIFIED'
                      ? 'text-white'
                      : 'text-muted-foreground italic'

            return (
                <div
                    className={`flex h-[30px] w-full items-center justify-center rounded px-2 text-center font-semibold ${textColor} ${bg}`}
                >
                    {result}
                </div>
            )
        }
    }

    return [...baseColumns, resultColumn]
}
