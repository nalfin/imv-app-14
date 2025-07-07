'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Member } from '@/types/member'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ActionCell } from './action-cell'

export const getColumns = (
    onEdit: (member: Member) => void,
    onDelete: (id: string) => Promise<void>
): ColumnDef<Member>[] => {
    return [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            size: 40,
            minSize: 40,
            maxSize: 40,
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: 'name',
            header: 'Member Name'
        },
        {
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
            accessorKey: 'lvl',
            cell: ({ row }) => <div className="ml-4">{row.getValue('lvl')}</div>
        },
        {
            accessorKey: 'role',
            header: 'Role'
        },
        {
            accessorKey: 'trop',
            header: 'Trops'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue<'ACTIVE' | 'INACTIVE'>('status')
                return (
                    <span
                        className={`inline-block w-20 rounded py-1 text-center text-xs font-semibold text-white ${
                            status === 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                    >
                        {status}
                    </span>
                )
            }
        },
        {
            id: 'actions',
            size: 50,
            minSize: 50,
            maxSize: 50,
            cell: ({ row }) => (
                <ActionCell
                    member={row.original}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )
        }
    ]
}
