'use client'

import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { FullScreenLoader } from '@/components/fullscreen-loader'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { addMember } from '@/lib/api/member/add-member'
import { lv } from 'date-fns/locale'
import RadioRole from './radio-role'

export function DialogAddMember({ onSuccess }: { onSuccess?: () => void }) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [lvl, setLvl] = useState<number | ''>('')
    const [trop, setTrop] = useState('')
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')
    const [isSubmit, setIsSubmit] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'loading' | 'success'
    >('idle')

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL

    const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        setLvl(isNaN(value) ? '' : value)

        if (value >= 30) setTrop('T10')
        else if (value >= 27) setTrop('T9')
        else if (value >= 24) setTrop('T8')
        else if (value >= 20) setTrop('T7')
        else if (value >= 17) setTrop('T6')
        else setTrop('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !lvl || !role || !trop || !status) {
            alert('❌ Semua field harus diisi!')
            return
        }

        setSubmitStatus('loading')

        try {
            const result = await addMember({
                name,
                lvl,
                role,
                trop,
                status
            })

            if (result.success) {
                setSubmitStatus('success')
                onSuccess?.()
                setTimeout(() => {
                    setOpen(false)
                    // Reset form
                    setName('')
                    setLvl('')
                    setTrop('')
                    setRole('')
                    setStatus('')
                    setSubmitStatus('idle')
                }, 1000)
            } else {
                alert('❌ Gagal: ' + result.message)
                setSubmitStatus('idle')
            }
        } catch (err) {
            console.error('❌ ERROR:', err)
            alert('Terjadi kesalahan koneksi.')
            setSubmitStatus('idle')
        }
    }

    return (
        <>
            {isSubmit && <FullScreenLoader />}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <PlusCircle />
                        Add Member
                    </Button>
                </DialogTrigger>
                <DialogContent className="font-mono sm:max-w-[425px]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <DialogHeader>
                            <DialogTitle>Add Member IMV</DialogTitle>
                            <DialogDescription>
                                Tambahkan member baru di Indonesian Mafia
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Nick Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-1 grid gap-3">
                                    <Label htmlFor="lvl">Level HQ</Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            id="lvl"
                                            name="lvl"
                                            type="number"
                                            placeholder="30"
                                            value={lvl}
                                            onChange={handleLevelChange}
                                            required
                                        />
                                        <span className="grid h-9 w-16 items-center rounded-md border border-border text-center text-sm">
                                            {lvl === '' ? 'T0' : trop}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-1 grid gap-3">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={status}
                                        onValueChange={(value) =>
                                            setStatus(value)
                                        }
                                        required
                                    >
                                        <SelectTrigger className="w-[180px]">
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
                            <div className="grid gap-3">
                                <Label htmlFor="role">Role</Label>
                                <div className="rounded-sm border border-border bg-input/30 p-3">
                                    <RadioRole
                                        value={role}
                                        onChange={setRole}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-3">
                            <Button
                                type="submit"
                                className={`w-full ${
                                    submitStatus === 'success'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-indigo-500 hover:bg-indigo-600'
                                } text-white`}
                                disabled={submitStatus === 'loading'}
                            >
                                {submitStatus === 'loading' ? (
                                    <div className="flex items-center space-x-1">
                                        <LoadingSpinner className="size-4" />
                                        <span>LOADING ...</span>
                                    </div>
                                ) : submitStatus === 'success' ? (
                                    <span>SUCCESS</span>
                                ) : (
                                    'SUBMIT'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
