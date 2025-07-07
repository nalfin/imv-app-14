// export type VSDA = {
//     id: string
//     name: string
//     hq: number
//     d1?: { date: string; value: string }[]
//     d2?: { date: string; value: string }[]
//     d3?: { date: string; value: string }[]
//     d4?: { date: string; value: string }[]
//     d5?: { date: string; value: string }[]
//     d6?: { date: string; value: string }[]
// }

export type DataPoint = {
    date: string
    value: string
}
export type VSDA = {
    id: string
    name: string
    hq: number
    data_point_da: DataPoint[]
}
