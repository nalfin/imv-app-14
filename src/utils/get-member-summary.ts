import { Member } from '@/types/member'

export function getMemberSummary(data: Member[]) {
    const total = data.length
    const upLevelCount = data.filter((member) => member.lvl >= 27).length
    const midLevelCount = data.filter(
        (member) => member.lvl >= 24 && member.lvl <= 26
    ).length
    const downLevelCount = data.filter((member) => member.lvl < 24).length

    return {
        total,
        upLevelCount,
        midLevelCount,
        downLevelCount
    }
}
