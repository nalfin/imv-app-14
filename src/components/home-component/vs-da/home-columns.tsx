import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { VSDA } from '@/types/vsda'

function sortingHeader(label: string, column: any) {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            {label}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    )
}

function renderHQColumn(): ColumnDef<VSDA> {
    return {
        accessorKey: 'hq',
        header: ({ column }) => sortingHeader('HQ', column),
        cell: ({ row }) => {
            const hq = row.getValue<number>('hq')
            const bg =
                hq >= 27
                    ? 'bg-transparent border border-green-600 text-white'
                    : ''
            return (
                <div className={`ml-4 rounded px-2 py-1 text-center ${bg}`}>
                    {hq}
                </div>
            )
        },
        size: 80
    }
}

function formatToYYYYMMDD(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

function getDateRangeWithoutSunday(start: Date, end: Date): Date[] {
    const dates: Date[] = []
    const current = new Date(start)
    while (current <= end) {
        if (current.getDay() !== 0) {
            dates.push(new Date(current))
        }
        current.setDate(current.getDate() + 1)
    }
    return dates
}

function formatHeaderWithDate(idx: number, date: Date): string {
    const day = date.getDate()
    const month = date.getMonth() + 1
    return `D${idx + 1} (${day}/${month})`
}

export const getColumnsHomeVSDA = (
    startDate: Date | null,
    endDate: Date | null,
    showDateHeader: boolean
): ColumnDef<VSDA>[] => {
    if (!startDate || !endDate) return []

    const dateObjects = getDateRangeWithoutSunday(startDate, endDate)

    const dateKeys = dateObjects.map(formatToYYYYMMDD)

    return [
        {
            accessorKey: 'name',
            header: ({ column }) => sortingHeader('Member Name', column),
            cell: ({ row }) => (
                <div className="ml-4">{row.getValue('name')}</div>
            )
        },
        renderHQColumn(),

        // D1–D6 Columns
        ...dateObjects.map((dateObj, idx) => {
            const dateStr = formatToYYYYMMDD(dateObj)
            return {
                id: `date-${idx}`,
                header: showDateHeader
                    ? formatHeaderWithDate(idx, dateObj)
                    : `D${idx + 1}`,

                accessorFn: (row: VSDA) => {
                    const found = row.data_point_da.find(
                        (d) => d.date === dateStr
                    )
                    return found?.value || ''
                },
                cell: ({ row }: { row: { original: VSDA } }) => {
                    const value = row.original.data_point_da.find(
                        (d: { date: string }) => d.date === dateStr
                    )?.value

                    const match = value?.match(/\d+/)
                    const number = match ? parseInt(match[0], 10) : null

                    const bgColor =
                        number === null
                            ? 'bg-transparent'
                            : number >= 7
                              ? 'bg-green-600'
                              : 'bg-red-700'

                    return (
                        <div
                            className={`${bgColor} w-full rounded px-2 py-1 text-center`}
                        >
                            {value || '-'}
                        </div>
                    )
                },
                size: 80
            }
        }),

        {
            id: 'percentage',
            header: ({ column }) => sortingHeader('%', column),
            accessorFn: (row) => {
                const values = row.data_point_da
                    .filter((d) => dateKeys.includes(d.date))
                    .map((d) => {
                        const match = d.value.match(/\d+/)
                        return match ? parseInt(match[0], 10) : 0
                    })

                const total = values.reduce((sum, val) => sum + val, 0)
                const maxTotal = dateKeys.length * 9 // maksimal poin per hari = 9
                return Math.round((total / maxTotal) * 100)
            },
            cell: ({ getValue }) => {
                const percentage = getValue<number>()
                return <div className="ml-4 font-semibold">{percentage}%</div>
            },
            size: 80
        }
    ]
}
