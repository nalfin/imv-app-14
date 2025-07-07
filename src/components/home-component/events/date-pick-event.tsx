'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'

function formatDate(date: Date | undefined) {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

function isValidDate(date: Date | undefined) {
    return !!date && !isNaN(date.getTime())
}

export function DatePickEvent({
    valueStartDate,
    valueEndDate,
    onChangeStartDate,
    onChangeEndDate
}: {
    valueStartDate: Date | undefined
    valueEndDate: Date | undefined
    onChangeStartDate: (date: Date | undefined) => void
    onChangeEndDate: (date: Date | undefined) => void
}) {
    const [openStart, setOpenStart] = React.useState(false)
    const [openEnd, setOpenEnd] = React.useState(false)

    const [monthStart, setMonthStart] = React.useState<Date | undefined>(
        valueStartDate
    )
    const [monthEnd, setMonthEnd] = React.useState<Date | undefined>(
        valueEndDate
    )

    const [inputStart, setInputStart] = React.useState(
        formatDate(valueStartDate)
    )
    const [inputEnd, setInputEnd] = React.useState(formatDate(valueEndDate))

    // Sync input & calendar state when external value changes
    React.useEffect(() => {
        setInputStart(formatDate(valueStartDate))
        setMonthStart(valueStartDate)
    }, [valueStartDate])

    React.useEffect(() => {
        setInputEnd(formatDate(valueEndDate))
        setMonthEnd(valueEndDate)
    }, [valueEndDate])

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                {/* Start Date */}
                <div className="flex flex-col gap-1">
                    <div className="relative flex gap-2">
                        <Input
                            id="startDate"
                            value={inputStart}
                            placeholder="June 01, 2025"
                            className="bg-background pr-10 text-sm font-medium"
                            onChange={(e) => {
                                const str = e.target.value
                                const date = new Date(str)
                                setInputStart(str)
                                if (isValidDate(date)) {
                                    onChangeStartDate(date)
                                    setMonthStart(date)
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                    e.preventDefault()
                                    setOpenStart(true)
                                }
                            }}
                        />
                        <Popover open={openStart} onOpenChange={setOpenStart}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                >
                                    <CalendarIcon className="size-3.5" />
                                    <span className="sr-only">
                                        Select start date
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="end"
                                sideOffset={10}
                            >
                                <Calendar
                                    mode="single"
                                    selected={valueStartDate}
                                    captionLayout="dropdown"
                                    month={monthStart}
                                    onMonthChange={setMonthStart}
                                    onSelect={(date) => {
                                        if (date) {
                                            onChangeStartDate(date)
                                            setInputStart(formatDate(date))
                                            setOpenStart(false)
                                        }
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <span className="text-muted-foreground text-sm">to</span>

                {/* End Date */}
                <div className="flex flex-col gap-1">
                    <div className="relative flex gap-2">
                        <Input
                            id="endDate"
                            value={inputEnd}
                            placeholder="June 30, 2025"
                            className="bg-background pr-10 text-sm font-medium"
                            onChange={(e) => {
                                const str = e.target.value
                                const date = new Date(str)
                                setInputEnd(str)
                                if (isValidDate(date)) {
                                    onChangeEndDate(date)
                                    setMonthEnd(date)
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                    e.preventDefault()
                                    setOpenEnd(true)
                                }
                            }}
                        />
                        <Popover open={openEnd} onOpenChange={setOpenEnd}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                >
                                    <CalendarIcon className="size-3.5" />
                                    <span className="sr-only">
                                        Select end date
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="end"
                                sideOffset={10}
                            >
                                <Calendar
                                    mode="single"
                                    selected={valueEndDate}
                                    captionLayout="dropdown"
                                    month={monthEnd}
                                    onMonthChange={setMonthEnd}
                                    onSelect={(date) => {
                                        if (date) {
                                            onChangeEndDate(date)
                                            setInputEnd(formatDate(date))
                                            setOpenEnd(false)
                                        }
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
        </div>
    )
}
