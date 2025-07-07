export interface MemberPayload {
    id: string
    name: string
    hq: number
}

export async function addEventDA(
    eventName: string,
    members: MemberPayload[]
): Promise<{ success: boolean; message?: string }> {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL

    const formBody = new URLSearchParams()
    formBody.append('action', 'addEventDA')
    formBody.append('eventName', eventName)
    formBody.append('members', JSON.stringify(members))

    try {
        const res = await fetch(baseURL!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody.toString()
        })

        const result = await res.json()
        return result
    } catch (err: any) {
        console.error('addEventDA error:', err)
        return { success: false, message: 'Fetch failed' }
    }
}
