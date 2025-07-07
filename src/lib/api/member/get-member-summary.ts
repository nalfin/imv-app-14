export async function fetchMemberSummary() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}?action=readMemberSummary`
    )
    const result = await res.json()

    if (result.success) {
        return result.data // ✅ Sudah sesuai bentuknya
    } else {
        throw new Error(result.message || 'Gagal mengambil data')
    }
}
