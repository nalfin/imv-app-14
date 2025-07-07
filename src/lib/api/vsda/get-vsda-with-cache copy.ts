export async function fetchVSDAWithCache(startDate: string) {
    const cacheKey = `vsda-cache-${startDate}`
    const cached = null // Paksa skip cache untuk debug

    if (cached) {
        try {
            const parsed = JSON.parse(cached)
            return parsed
        } catch (err) {
            localStorage.removeItem(cacheKey)
        }
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}?action=readVSDA&startDate=${startDate}`
    )

    const result = await res.json()

    if (result.success) {
        const mapped = result.data.map((item: any) => {
            return {
                id: item.id,
                name: item.name,
                hq: item.hq,
                d1: item.d1 ?? [{ date: '', value: '' }],
                d2: item.d2 ?? [{ date: '', value: '' }],
                d3: item.d3 ?? [{ date: '', value: '' }],
                d4: item.d4 ?? [{ date: '', value: '' }],
                d5: item.d5 ?? [{ date: '', value: '' }],
                d6: item.d6 ?? [{ date: '', value: '' }]
            }
        })

        localStorage.setItem(cacheKey, JSON.stringify(mapped))
        return mapped
    } else {
        console.error('❌ Gagal fetch VSDA:', result.message)
        throw new Error(result.message || 'Gagal mengambil data')
    }
}
