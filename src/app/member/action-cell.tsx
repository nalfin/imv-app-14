'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Loader2, MoreHorizontal } from 'lucide-react'
import { Member } from '@/types/member'

interface ActionCellProps {
    member: Member
    onEdit: (member: Member) => void
    onDelete: (id: string) => Promise<void>
}

export function ActionCell({ member, onEdit, onDelete }: ActionCellProps) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        const confirmDelete = confirm(`Yakin ingin menghapus ${member.name}?`)
        if (!confirmDelete) return

        setLoading(true)
        try {
            await onDelete(member.id)
        } finally {
            setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-mono">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(member.name)}
                >
                    Copy Name
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(member)}>
                    Edit Member
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-700"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center gap-2 text-red-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Deleting...</span>
                        </div>
                    ) : (
                        'Hapus Member'
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
