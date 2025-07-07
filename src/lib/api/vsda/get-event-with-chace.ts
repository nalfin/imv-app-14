import { EventMember } from '@/types/event'

export async function fetchEventWithCache(
    startDate: string,
    endDate: string,
    eventName: string
): Promise<EventMember[]> {
    const cacheKey = `vsda-cache-${startDate}-${endDate}-${eventName}`
    const cached = null // Paksa skip cache untuk debug, nanti bisa pakai: localStorage.getItem(cacheKey)

    if (cached) {
        try {
            return JSON.parse(cached)
        } catch (err) {
            localStorage.removeItem(cacheKey)
        }
    }

    const params = new URLSearchParams({
        action: 'readVSDAEvent',
        startDate,
        endDate,
        eventName
    })

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}?${params}`)
    const result = await res.json()

    if (result.success) {
        localStorage.setItem(cacheKey, JSON.stringify(result.data))
        return result.data as EventMember[]
    } else {
        console.error('❌ Gagal fetch VSDA Event:', result.message)
        throw new Error(result.message || 'Gagal mengambil data')
    }
}
