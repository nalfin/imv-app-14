'use client'

import * as React from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    VisibilityState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
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

import { DialogAddMember } from './dialog-add'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Member } from '@/types/member'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onSuccess: () => void
    showFromLast: boolean
    setShowFromLast: (value: boolean) => void
    onBulkEditOpen: (selected: Member[]) => void
}

export function DataTable<TData extends Member, TValue>({
    columns,
    data,
    onSuccess,
    showFromLast,
    setShowFromLast,
    onBulkEditOpen
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
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
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        }
    })

    const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original)

    return (
        <>
            <div className="min-w-full space-y-3 font-mono">
                <div className="flex flex-col-reverse gap-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6">
                    <div className="flex w-full items-center gap-6 md:max-w-md md:gap-4">
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
                        <Button
                            variant="outline"
                            size="default"
                            className="rounded-sm"
                            onClick={() => onBulkEditOpen(selectedRows)}
                            disabled={selectedRows.length === 0}
                        >
                            Edit Selected
                        </Button>
                    </div>

                    <div className="flex justify-between gap-3">
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
                        <DialogAddMember onSuccess={onSuccess} />
                    </div>
                </div>

                <ScrollArea className="w-full whitespace-nowrap rounded-md border">
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
                                                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent transition-all duration-300 group-hover:bg-blue-400"
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

                <div className="flex items-center justify-end space-x-2 py-4">
                    <Checkbox
                        id="uncheckAll"
                        checked={
                            table.getFilteredSelectedRowModel().rows.length > 0
                        }
                        onCheckedChange={() => {
                            // Uncheck semua yang terseleksi di halaman saat ini
                            table.resetRowSelection()
                        }}
                    />
                    <div className="flex-1 text-sm text-muted-foreground">
                        {selectedRows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </div>
                    <div className="flex items-center space-x-2">
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
