'use client'

import { FullScreenLoader } from '@/components/fullscreen-loader'
import LayoutPages from '@/components/layout-pages'
import { fetchMemberSummary } from '@/lib/api/member/get-member-summary'
import { useEffect, useState } from 'react'
import CardMemberDynamic from './member/card-member-dynamic'
import HomeVSDAPage from '@/components/home-component/vs-da/home-vsda-page'
import HomeEventPage from '@/components/home-component/events/home-event-page'

export default function Home() {
    const [loading, setLoading] = useState(true)

    const getData = async () => {
        try {
            setLoading(true)
            const members = await fetchMemberSummary()
        } catch (err) {
            console.error('Fetch error:', err)
            alert('Gagal mengambil data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])
    return (
        <LayoutPages>
            {loading && <FullScreenLoader />}
            <div className="grid grid-cols-1 gap-6">
                <CardMemberDynamic />
                <div className="grid grid-cols-1 gap-6 font-mono lg:grid-cols-4">
                    <div className="col-span-2">
                        <HomeVSDAPage />
                    </div>
                    <div className="col-span-2">
                        <HomeEventPage />
                    </div>
                </div>
            </div>
        </LayoutPages>
    )
}
