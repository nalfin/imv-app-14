import { useEffect, useState } from 'react'
import CardMemberSingle from './card-single'
import { SummaryWithChange } from '@/types/member-summary'
import { fetchMemberSummary } from '@/lib/api/member/get-member-summary'
import { processSummaryByWeek } from '@/lib/api/process-summary-by-week'

function getChangeLabel(change: number): string {
    if (change > 0) return `Naik ${change} dibanding minggu lalu`
    if (change < 0) return `Turun ${Math.abs(change)} dibanding minggu lalu`
    return 'Tidak berubah dari minggu lalu'
}

export default function CardMemberDynamic() {
    const [summary, setSummary] = useState<SummaryWithChange | null>(null)

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const rawData = await fetchMemberSummary()

                // Map jika key-nya masih "HQ < 26", ubah jadi "HQ < 24"
                const fixedData = rawData.map((item: any) => ({
                    timestamp: item.TIMESTAMP,
                    total: item.TOTAL,
                    'HQ ≥ 27': item['HQ >= 27'],
                    'HQ 24-26': item['HQ 24-26'],
                    'HQ < 24': item['HQ < 26'] // 🛠 ubah key agar seragam
                }))

                const processed = processSummaryByWeek(fixedData)
                setSummary(processed)
            } catch (error) {
                console.error('Gagal ambil summary member:', error)
            }
        }

        fetchSummary()
    }, [])

    if (!summary) return null

    return (
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            <CardMemberSingle
                title="Jumlah Anggota"
                content={`${summary.total.value}/100`}
                change={summary.total.change}
                subtitle={getChangeLabel(summary.total.change)}
            />
            <CardMemberSingle
                title="Jumlah HQ ≥ 27"
                content={`${summary.up.value}/${summary.total.value}`}
                change={summary.up.change}
                subtitle={getChangeLabel(summary.up.change)}
            />
            <CardMemberSingle
                title="Jumlah HQ 24-26"
                content={`${summary.mid.value}/${summary.total.value}`}
                change={summary.mid.change}
                subtitle={getChangeLabel(summary.mid.change)}
            />
            <CardMemberSingle
                title="Jumlah HQ < 24"
                content={`${summary.down.value}/${summary.total.value}`}
                change={summary.down.change}
                subtitle={getChangeLabel(summary.down.change)}
            />
        </div>
    )
}
