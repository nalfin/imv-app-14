import { VSDA } from '@/types/vsda'

interface UpdateVSDAInput {
    data: VSDA[]
    tanggal: Date | undefined
    poin: string
}

export async function updateVSDA({ data, tanggal, poin }: UpdateVSDAInput) {
    const formattedDate = tanggal
        ? `${tanggal.getDate().toString().padStart(2, '0')}/${(
              tanggal.getMonth() + 1
          )
              .toString()
              .padStart(2, '0')}`
        : ''

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL

    for (const item of data) {
        const form = new URLSearchParams()
        form.append('id', item.id)
        form.append('tanggal', formattedDate)
        form.append('value', poin)

        const res = await fetch(`${baseURL}?action=updatePoinDA`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: form.toString()
        })

        const result = await res.json()

        if (!result.success) {
            console.error('❌ Gagal:', result.message)
            throw new Error(result.message)
        }
    }

    return { success: true }
}
