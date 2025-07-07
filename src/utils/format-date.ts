// utils/format-date.ts
import { format } from 'date-fns'

export function formatDate(date?: Date) {
    if (!date) return ''
    return format(date, 'MMMM dd, yyyy')
}
