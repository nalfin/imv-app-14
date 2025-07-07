interface AddMemberInput {
    name: string
    lvl: number
    trop: string
    role: string
    status: string
}

export async function addMember(data: AddMemberInput) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL

    const formBody = new URLSearchParams()
    formBody.append('name', data.name)
    formBody.append('lvl', String(data.lvl))
    formBody.append('role', data.role)
    formBody.append('trop', data.trop)
    formBody.append('status', data.status)

    const res = await fetch(`${baseURL}?action=addMember`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody.toString()
    })

    const result = await res.json()
    return result
}
