'use client'

import { useState } from 'react'
import { Member } from '@/types/member'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedMembers: Member[]
    onSuccess: () => void
    setLoadingEditBulk: (value: boolean) => void
}

export function DialogBulkEditMembers({
    open,
    onOpenChange,
    selectedMembers,
    setLoadingEditBulk,
    onSuccess
}: Props) {
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')
    const [isSubmit, setIsSubmit] = useState(false)
    const [progress, setProgress] = useState(0)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!role || !status) {
            alert('❌ Role dan Status harus diisi!')
            return
        }

        setIsSubmit(true)
        setLoadingEditBulk(true)
        setProgress(0)

        let successCount = 0

        for (let i = 0; i < selectedMembers.length; i++) {
            const m = selectedMembers[i]
            setProgress(i + 1)

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}?action=updateMember`,
                    {
                        method: 'POST',
                        body: new URLSearchParams({
                            id: m.id,
                            nama: m.name, // tetap pakai nama dari state
                            level: m.lvl.toString(), // pakai level dari DB
                            role,
                            trops: m.trop, // pakai trop dari DB
                            status
                        })
                    }
                )

                const result = await res.json()
                if (result.success) {
                    successCount++
                }
            } catch (error) {
                console.error('❌ Error updating', m.name, error)
            }
        }

        setIsSuccess(true)
        onSuccess()

        setTimeout(() => {
            onOpenChange(false)
            setIsSuccess(false)
            setLoadingEditBulk(false)
        }, 1000)

        setIsSubmit(false)
        setProgress(0)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="font-mono sm:max-w-[425px]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Edit Selected Members</DialogTitle>
                        <DialogDescription>
                            Update hanya Role dan Status member yang dipilih.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2 rounded-sm border border-border bg-input/30 p-4 text-sm">
                            <p className="text-sm text-muted-foreground">
                                Daftar member:
                            </p>
                            <p className="text-sm text-foreground">
                                {selectedMembers.map((m) => m.name).join(', ')}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-3">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={role}
                                    onValueChange={setRole}
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['R5', 'R4', 'R3', 'R2', 'R1'].map(
                                            (r) => (
                                                <SelectItem key={r} value={r}>
                                                    {r}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={status}
                                    onValueChange={setStatus}
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">
                                            ACTIVE
                                        </SelectItem>
                                        <SelectItem value="INACTIVE">
                                            INACTIVE
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            type="submit"
                            disabled={isSubmit}
                            className={`w-full text-white ${
                                isSuccess
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-indigo-500 hover:bg-indigo-600'
                            }`}
                        >
                            {isSubmit ? (
                                <span>
                                    LOADING... ({progress}/
                                    {selectedMembers.length})
                                </span>
                            ) : isSuccess ? (
                                'SUCCESS'
                            ) : (
                                'UPDATE'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
