'use client'

import { useEffect, useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchMembers } from '@/lib/api/member/get-member'
import { Member } from '@/types/member'
import { addEventDA } from '@/lib/api/event/add-event'

export function DialogCreateEvent() {
    const [eventName, setEventName] = useState('')
    const [isSubmit, setIsSubmit] = useState(false)
    const [open, setOpen] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'loading' | 'success'
    >('idle')
    const [data, setData] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)

    const [hqStart, setHqStart] = useState<number>(0)
    const [hqEnd, setHqEnd] = useState<number>(0)
    const [filteredNames, setFilteredNames] = useState<string[]>([])

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL

    // Fetch data member
    const getDataMember = async () => {
        try {
            setLoading(true)
            const members = await fetchMembers()
            setData(members)
        } catch (err) {
            console.error('Fetch error:', err)
            alert('Gagal mengambil data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getDataMember()
    }, [])

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitStatus('loading')

        if (!eventName.trim()) {
            alert('Nama event harus diisi.')
            setSubmitStatus('idle')
            return
        }

        if (hqStart === 0 || hqEnd === 0 || hqStart > hqEnd) {
            alert('Mohon masukkan range HQ level yang valid.')
            setSubmitStatus('idle')
            return
        }

        const filtered = data.filter(
            (member) => member.lvl >= hqStart && member.lvl <= hqEnd
        )

        const membersPayload = filtered.map((m) => ({
            id: m.id,
            name: m.name,
            hq: m.lvl
        }))

        const result = await addEventDA(eventName, membersPayload)

        if (result.success) {
            setFilteredNames(filtered.map((m) => m.name))
            setSubmitStatus('success')
        } else {
            alert(result.message || 'Gagal menyimpan event.')
            setSubmitStatus('idle')
        }
    }

    useEffect(() => {
        if (submitStatus === 'success') {
            // Tutup dialog setelah sedikit delay
            setTimeout(() => {
                setOpen(false)
                setSubmitStatus('idle')
                setEventName('')
                setHqStart(0)
                setHqEnd(0)
                setFilteredNames([])
            }, 1000) // delay 1 detik agar user sempat lihat "SUCCESS"
        }
    }, [submitStatus])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusCircle /> Add Event
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Tambah Event</DialogTitle>
                        <DialogDescription>
                            Tambah event mingguan anggota Indonesian Mafia
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="eventName">Event Name</Label>
                            <Input
                                id="eventName"
                                name="eventName"
                                placeholder="EVENT I"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-3">
                                <Label htmlFor="hqStart">
                                    Level HQ Terendah
                                </Label>
                                <Input
                                    id="hqStart"
                                    name="hqStart"
                                    placeholder="24"
                                    type="number"
                                    value={hqStart}
                                    onChange={(e) =>
                                        setHqStart(Number(e.target.value))
                                    }
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="hqEnd">
                                    Level HQ Tertinggi
                                </Label>
                                <Input
                                    id="hqEnd"
                                    name="hqEnd"
                                    placeholder="26"
                                    type="number"
                                    value={hqEnd}
                                    onChange={(e) =>
                                        setHqEnd(Number(e.target.value))
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
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
    )
}
