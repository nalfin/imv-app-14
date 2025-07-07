'use client'

import MemberTable from './member-table'
import { useEffect, useState } from 'react'
import { Member } from '@/types/member'
import { FullScreenLoader } from '@/components/fullscreen-loader'
import { fetchMembers } from '@/lib/api/member/get-member'
import CardMemberDynamic from './card-member-dynamic'
import { useAuthRedirect } from '@/lib/api/auth-redirect'
import LayoutPages from '@/components/layout-pages'

const MemberPage = () => {
    const checked = useAuthRedirect() // 🔒 Cek login

    const [data, setData] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingEditBulk, setLoadingEditBulk] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const getData = async () => {
        try {
            setLoading(true)
            const members = await fetchMembers()
            setData(members)
        } catch (err) {
            console.error('Fetch error:', err)
            alert('Gagal mengambil data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (checked) {
            getData()
        }
    }, [checked])

    const handleDelete = async (id: string) => {
        setDeleting(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}?action=deleteMember&id=${id}`,
                {
                    method: 'GET'
                }
            )
            const result = await res.json()
            if (result.success) {
                getData()
            } else {
                alert('❌ Gagal menghapus: ' + result.message)
            }
        } catch (error) {
            console.error(error)
            alert('❌ Terjadi kesalahan koneksi')
        }
        setDeleting(false)
    }

    // ⛔️ Jangan render apapun sebelum auth dicek
    if (!checked) return null

    return (
        <LayoutPages>
            {(loading || deleting || loadingEditBulk) && <FullScreenLoader />}
            <div className="space-y-3">
                <h1 className="text-2xl font-bold">Dashboard Member</h1>
                <CardMemberDynamic />
                <MemberTable
                    data={data}
                    fetchData={getData}
                    loading={loading}
                    onDelete={handleDelete}
                    setLoadingEditBulk={setLoadingEditBulk}
                />
            </div>
        </LayoutPages>
    )
}

export default MemberPage
