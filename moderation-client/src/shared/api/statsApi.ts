import type {
	PeriodKey,
	StatsSnapshot,
	SummaryStats,
	ActivityPoint,
	DecisionsDistribution,
	CategoryStat,
} from '../types/stats'

type ServerPeriod = 'today' | 'week' | 'month'

interface StatsSummaryApi {
	totalReviewed: number
	totalReviewedToday: number
	totalReviewedThisWeek: number
	totalReviewedThisMonth: number
	approvedPercentage: number
	rejectedPercentage: number
	requestChangesPercentage: number
	averageReviewTime: number
}

interface ActivityDataApi {
	date: string
	approved: number
	rejected: number
	requestChanges: number
}

interface DecisionsDataApi {
	approved: number
	rejected: number
	requestChanges: number
}

type CategoriesApi = Record<string, number>

const mapPeriodToServer = (period: PeriodKey): ServerPeriod => {
	switch (period) {
		case 'today':
			return 'today'
		case '7d':
			return 'week'
		case '30d':
		default:
			return 'month'
	}
}

const toSummary = (api: StatsSummaryApi): SummaryStats => ({
	checked: api.totalReviewed,
	approvedPercent: api.approvedPercentage,
	rejectedPercent: api.rejectedPercentage,
	avgReviewMinutes: api.averageReviewTime,
})

const toActivity = (items: ActivityDataApi[]): ActivityPoint[] =>
	items.map(item => {
		const date = new Date(item.date)
		const label = Number.isNaN(date.getTime())
			? item.date
			: date.toLocaleDateString('ru-RU', {
					day: '2-digit',
					month: '2-digit',
			  })

		return {
			dayLabel: label,
			value: item.approved + item.rejected + item.requestChanges,
		}
	})

const toDecisions = (api: DecisionsDataApi): DecisionsDistribution => ({
	approved: api.approved,
	rejected: api.rejected,
	needsChanges: api.requestChanges,
})

const toCategories = (api: CategoriesApi): CategoryStat[] =>
	Object.entries(api).map(([category, value]) => ({
		category,
		value,
	}))

export const fetchStatsSnapshot = async (
	period: PeriodKey
): Promise<StatsSnapshot> => {
	const serverPeriod = mapPeriodToServer(period)
	const params = new URLSearchParams({ period: serverPeriod }).toString()
	const base = '/api/v1'

	const [summaryRes, activityRes, decisionsRes, categoriesRes] =
		await Promise.all([
			fetch(`${base}/stats/summary?${params}`),
			fetch(`${base}/stats/chart/activity?${params}`),
			fetch(`${base}/stats/chart/decisions?${params}`),
			fetch(`${base}/stats/chart/categories?${params}`),
		])

	if (
		!summaryRes.ok ||
		!activityRes.ok ||
		!decisionsRes.ok ||
		!categoriesRes.ok
	) {
		throw new Error('Failed to fetch stats')
	}

	const summaryJson = (await summaryRes.json()) as StatsSummaryApi
	const activityJson = (await activityRes.json()) as ActivityDataApi[]
	const decisionsJson = (await decisionsRes.json()) as DecisionsDataApi
	const categoriesJson = (await categoriesRes.json()) as CategoriesApi

	const summary = toSummary(summaryJson)
	const activity = toActivity(activityJson)
	const decisions = toDecisions(decisionsJson)
	const categories = toCategories(categoriesJson)

	return {
		summary,
		activity,
		decisions,
		categories,
	}
}
