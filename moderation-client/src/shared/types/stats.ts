export type PeriodKey = 'today' | '7d' | '30d'

export interface SummaryStats {
	checked: number
	approvedPercent: number
	rejectedPercent: number
	avgReviewMinutes: number
}

export interface ActivityPoint {
	dayLabel: string
	value: number
}

export interface DecisionsDistribution {
	approved: number
	rejected: number
	needsChanges: number
}

export interface CategoryStat {
	category: string
	value: number
}

export interface StatsSnapshot {
	summary: SummaryStats
	activity: ActivityPoint[]
	decisions: DecisionsDistribution
	categories: CategoryStat[]
}

export const normalizeToPercent = (value: number, max: number): number =>
	max === 0 ? 0 : Math.round((value / max) * 100)
