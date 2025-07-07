'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { DatePickerForm } from './date-picker-form'
import RadioVsDA from './radio-button-vsda'
import { useState } from 'react'
import { FullScreenLoader } from '@/components/fullscreen-loader'
import { VSDA } from '@/types/vsda'
import { updateVSDA } from '@/lib/api/vsda/update-vsda'
import { LoadingSpinner } from '@/components/loading-spinner'
import { format } from 'date-fns'
interface vsdaEditProps {
    allDataVSDA: VSDA[]
    selectedDataVSDA: VSDA[]
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

const DialogEditVSDA = ({
    allDataVSDA,
    selectedDataVSDA,
    open,
    onOpenChange,
    onSuccess
}: vsdaEditProps) => {
    const [isSubmit, setIsSubmit] = useState(false)
    const [selectedPoin, setSelectedPoin] = useState<string>('')
    const [selectedTanggal, setSelectedTanggal] = useState<Date | undefined>()
    const [progress, setProgress] = useState(0)
    const [isSuccess, setIsSuccess] = useState(false)

    const totalItems = selectedDataVSDA.length

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmit(true)
        setProgress(0)
        setIsSuccess(false)

        try {
            for (let i = 0; i < selectedDataVSDA.length; i++) {
                await updateVSDA({
                    data: [selectedDataVSDA[i]],
                    tanggal: selectedTanggal,
                    poin: selectedPoin
                })

                setProgress((prev) => prev + 1)
            }

            setIsSuccess(true)
            if (onSuccess) onSuccess()
            setTimeout(() => {
                onOpenChange(false)
            }, 1000)
        } catch (err) {
            console.error(err)
            alert('Gagal update data')
        } finally {
            setIsSubmit(false)
        }
    }

    const selectedDateFormatted = selectedTanggal
        ? format(selectedTanggal, 'yyyy-MM-dd')
        : ''

    const jumlahTerisi = allDataVSDA.filter((v) =>
        v.data_point_da?.some(
            (p) => p.date === selectedDateFormatted && p.value !== ''
        )
    ).length

    console.log(jumlahTerisi, '/', allDataVSDA.length)

    const renderButtonText = () => {
        if (isSuccess) return 'SUCCESS'
        if (isSubmit)
            return (
                <div className="flex items-center space-x-1">
                    <LoadingSpinner className="size-4" />
                    <span>
                        LOADING ... ({progress}/{totalItems})
                    </span>
                </div>
            )
        return 'UPDATE'
    }

    return (
        <>
            {isSubmit && !isSuccess && <FullScreenLoader />}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="font-mono sm:max-w-[550px]">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <DialogHeader className="text-left">
                            <DialogTitle>Edit Poin DA</DialogTitle>
                            <DialogDescription>
                                Ubah data poin VS DA member Indonesian Mafia
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <DatePickerForm
                                value={selectedTanggal}
                                onChange={setSelectedTanggal}
                            />
                            <div className="rounded-sm border border-border bg-input/30 p-4">
                                <RadioVsDA
                                    value={selectedPoin}
                                    onChange={setSelectedPoin}
                                />
                            </div>
                            <div className="grid gap-3 rounded-sm border border-border bg-input/30 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Daftar nama yang diedit poinnya:
                                    </p>

                                    <span className="rounded-sm border border-border px-3 py-2 text-xs">
                                        {jumlahTerisi}/{allDataVSDA.length}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground">
                                    {(Array.isArray(selectedDataVSDA)
                                        ? selectedDataVSDA
                                        : [selectedDataVSDA]
                                    )
                                        .map((v) => v.name)
                                        .join(', ')}
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="mt-3">
                            <Button
                                type="submit"
                                className={`w-full text-white transition-all duration-300 hover:brightness-110 ${isSuccess ? 'bg-green-600' : 'bg-indigo-500 hover:bg-indigo-600'} `}
                                disabled={isSubmit}
                            >
                                {renderButtonText()}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DialogEditVSDA
