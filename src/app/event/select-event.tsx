// SelectEvent.tsx
'use client'

import * as React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { fetchEventList } from '@/lib/api/event/get-event-list'

interface Props {
    eventName: string | null
    setEventName: (val: string) => void
}

export function SelectEvent({ eventName, setEventName }: Props) {
    const [eventList, setEventList] = React.useState<string[]>([])

    React.useEffect(() => {
        fetchEventList().then((data) => {
            setEventList(data)
        })
    }, [])

    // Auto pilih event pertama kalau belum ada
    React.useEffect(() => {
        if (!eventName && eventList.length > 0) {
            setEventName(eventList[0])
        }
    }, [eventList, eventName, setEventName])

    if (eventList.length === 0) {
        return <div className="text-muted-foreground">Loading events...</div>
    }

    const handleChange = (value: string) => {
        setEventName(value)
        localStorage.setItem('eventName', value)
    }

    return (
        <Select
            value={eventName ?? undefined}
            onValueChange={handleChange}
            name="event"
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select EVENT" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {eventList.map((event, i) => (
                        <SelectItem key={i} value={event}>
                            {event}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
