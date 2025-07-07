'use client'

import * as React from 'react'

import {
    ColumnDef,
    flexRender,
    SortingState,
    ColumnFiltersState,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { DatePickEvent } from './date-pick-event'
import { formatDate } from '@/utils/format-date'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    showFromLast: boolean
    setShowFromLast: (value: boolean) => void
    startDate: Date | null
    endDate: Date | null
    setStartDate: (date: Date | null) => void
    setEndDate: (date: Date | null) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    showFromLast,
    setShowFromLast,
    startDate,
    endDate,
    setStartDate,
    setEndDate
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        state: {
            sorting,
            columnFilters,
            rowSelection
        }
    })

    return (
        <>
            <div className="min-w-full space-y-3 font-mono">
                {/* Search & Top Controls */}
                <div className="flex flex-col-reverse justify-between gap-6 py-4 md:flex-row md:items-center">
                    <div className="flex w-full items-center gap-3 lg:max-w-md">
                        <Input
                            className="w-full"
                            placeholder="Filter by name..."
                            value={
                                (table
                                    .getColumn('name')
                                    ?.getFilterValue() as string) ?? ''
                            }
                            onChange={(event) =>
                                table
                                    .getColumn('name')
                                    ?.setFilterValue(event.target.value)
                            }
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <DatePickEvent
                            valueStartDate={startDate ?? undefined}
                            valueEndDate={endDate ?? undefined}
                            onChangeStartDate={(d) => setStartDate(d ?? null)}
                            onChangeEndDate={(d) => setEndDate(d ?? null)}
                        />
                    </div>
                </div>

                {/* Table UI */}
                <ScrollArea className="w-full rounded-md border whitespace-nowrap">
                    <div className="overflow-x-auto rounded-md border font-mono">
                        <Table className="w-full table-auto">
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                style={{
                                                    width: header.getSize()
                                                }}
                                                className="group relative"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                                {header.column.getCanResize() && (
                                                    <div
                                                        onMouseDown={header.getResizeHandler()}
                                                        onTouchStart={header.getResizeHandler()}
                                                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent transition group-hover:bg-blue-400"
                                                    />
                                                )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Bottom Controls */}
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="flex items-center gap-3">
                        <div className="text-muted-foreground flex-1 text-sm">
                            {table.getFilteredSelectedRowModel().rows.length} of{' '}
                            {table.getFilteredRowModel().rows.length} row(s)
                            selected.
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="showLast"
                                checked={showFromLast}
                                onCheckedChange={(checked) =>
                                    setShowFromLast(!!checked)
                                }
                            />
                            <Label htmlFor="showLast">Show From Last</Label>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {startDate && endDate && (
                            <p className="text-muted-foreground px-1 text-sm">
                                Showing data from{' '}
                                <span className="text-primary font-medium">
                                    {formatDate(startDate)}
                                </span>{' '}
                                to{' '}
                                <span className="text-primary font-medium">
                                    {formatDate(endDate)}
                                </span>
                            </p>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
