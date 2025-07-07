interface UpdateMemberInput {
    id: string
    nama: string
    level: number
    role: string
    trop: string
    status: string
}

export async function updateMember({
    id,
    nama,
    level,
    role,
    trop,
    status
}: UpdateMemberInput) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL

    const formBody = new URLSearchParams()
    formBody.append('id', id)
    formBody.append('nama', nama)
    formBody.append('level', String(level))
    formBody.append('role', role)
    formBody.append('trops', trop)
    formBody.append('status', status)

    const res = await fetch(`${baseURL}?action=updateMember`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody.toString()
    })

    const result = await res.json()
    return result
}
