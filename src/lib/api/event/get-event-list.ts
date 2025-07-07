export async function fetchEventList(): Promise<string[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}?action=readEventList`
    )
    const result = await res.json()

    if (result.success) return result.data
    console.error(result.message)
    return []
}
