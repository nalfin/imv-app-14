import { SummaryWithChange } from '@/types/member-summary'

function calculateChange(current: number, previous: number): number {
    return current - previous
}

export function processSummary(data: any[]): SummaryWithChange | null {
    if (!data || data.length < 2) return null

    const sorted = [...data].sort(
        (a, b) =>
            new Date(b.TIMESTAMP).getTime() - new Date(a.TIMESTAMP).getTime()
    )

    const current = sorted[0]
    const previous = sorted[1]

    return {
        total: {
            value: current.TOTAL,
            change: calculateChange(current.TOTAL, previous.TOTAL)
        },
        up: {
            value: current['HQ >= 27'],
            change: calculateChange(current['HQ >= 27'], previous['HQ >= 27'])
        },
        mid: {
            value: current['HQ 24-26'],
            change: calculateChange(current['HQ 24-26'], previous['HQ 24-26'])
        },
        down: {
            value: current['HQ < 24'], // ✅ sesuaikan key-nya di sini
            change: calculateChange(current['HQ < 24'], previous['HQ < 24'])
        }
    }
}
