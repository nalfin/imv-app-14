'use client'

import { useState } from 'react'
import { Member } from '@/types/member'
import { DataTable } from './data-table'
import { getColumns } from './columns'
import { DialogEditMember } from './dialog-edit'
import { DialogBulkEditMembers } from './dialog-bulk-edit-members'

export default function MemberTable({
    data,
    fetchData,
    loading,
    onDelete,
    setLoadingEditBulk
}: {
    data: Member[]
    fetchData: () => void
    loading: boolean
    onDelete: (id: string) => Promise<void>
    setLoadingEditBulk: (value: boolean) => void
}) {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null)
    const [editOpen, setEditOpen] = useState(false)
    const [showFromLast, setShowFromLast] = useState(false)
    const [openBulkEdit, setOpenBulkEdit] = useState(false)
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([])

    const handleBulkEditOpen = (selected: Member[]) => {
        setSelectedMembers(selected)
        setOpenBulkEdit(true)
    }

    const handleEdit = (member: Member) => {
        setSelectedMember(member)
        setEditOpen(true)
    }

    const columns = getColumns(handleEdit, onDelete)

    return (
        <div className="grid gap-10">
            <DataTable<Member, unknown>
                columns={columns}
                data={showFromLast ? [...data].reverse() : data}
                onSuccess={fetchData}
                showFromLast={showFromLast}
                setShowFromLast={setShowFromLast}
                onBulkEditOpen={handleBulkEditOpen}
            />

            {/* Dialog edit satuan */}
            {selectedMember && (
                <DialogEditMember
                    member={selectedMember}
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    onSuccess={fetchData}
                />
            )}

            {/* {loading && <FullScreenLoader />} */}
            {/* BULK EDIT DIALOG */}
            {openBulkEdit && (
                <DialogBulkEditMembers
                    open={openBulkEdit}
                    onOpenChange={setOpenBulkEdit}
                    selectedMembers={selectedMembers}
                    onSuccess={fetchData}
                    setLoadingEditBulk={setLoadingEditBulk}
                />
            )}
        </div>
    )
}
