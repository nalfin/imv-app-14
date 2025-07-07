import { VSDA } from '@/types/vsda'

export async function fetchVSDAWithCache(
    startDate: string,
    endDate: string
): Promise<VSDA[]> {
    const cacheKey = `vsda-cache-${startDate}-${endDate}`
    const cached = null // Paksa skip cache untuk debug, nanti bisa pakai: localStorage.getItem(cacheKey)

    if (cached) {
        try {
            return JSON.parse(cached)
        } catch (err) {
            localStorage.removeItem(cacheKey)
        }
    }

    const params = new URLSearchParams({
        action: 'readVSDA',
        startDate,
        endDate
    })

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}?${params}`)
    const result = await res.json()

    if (result.success) {
        localStorage.setItem(cacheKey, JSON.stringify(result.data))
        return result.data as VSDA[]
    } else {
        console.error('❌ Gagal fetch VSDA Event:', result.message)
        throw new Error(result.message || 'Gagal mengambil data')
    }
}
