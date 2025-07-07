export type RawSummary = {
    TIMESTAMP: string
    TOTAL: number
    'HQ >= 27': number
    'HQ 24-26': number
    'HQ < 26': number
    ACTIVE: number
    INACTIVE: number
}

export type MemberSummary = {
    value: number
    change: number
}

export type SummaryWithChange = {
    total: { value: number; change: number }
    up: { value: number; change: number }
    mid: { value: number; change: number }
    down: { value: number; change: number }
}
