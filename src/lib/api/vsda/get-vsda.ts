export async function fetchVSDA(startDate?: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}?action=readVSDA&startDate=${startDate ?? '23/06'}`
    )
    const result = await res.json()

    if (result.success) {
        const mapped = result.data.map((item: any) => ({
            name: item.name,
            hq: item.hq,
            d1: item.d1 ?? [{ date: '', value: '' }],
            d2: item.d2 ?? [{ date: '', value: '' }],
            d3: item.d3 ?? [{ date: '', value: '' }],
            d4: item.d4 ?? [{ date: '', value: '' }],
            d5: item.d5 ?? [{ date: '', value: '' }],
            d6: item.d6 ?? [{ date: '', value: '' }]
        }))

        return mapped
    } else {
        throw new Error(result.message || 'Gagal mengambil data')
    }
}
