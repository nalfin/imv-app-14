export async function fetchMembers() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}?action=readMember`
    )
    const result = await res.json()

    if (result.success) {
        const mapped = result.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            lvl: parseInt(item.lvl),
            role: item.role,
            trop: item.trop,
            status: item.status
        }))
        return mapped
    } else {
        throw new Error(result.message || 'Gagal mengambil data')
    }
}
