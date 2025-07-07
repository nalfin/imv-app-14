export type Events = {
    id: string
    name: string
    hq: number
    data_point_da: {
        date: string
        value: string
    }[]
}

export type DataPoint = {
    date: string
    value: string
}

export type EventMember = {
    id: string
    name: string
    hq: number
    data_point_da: DataPoint[]
}
