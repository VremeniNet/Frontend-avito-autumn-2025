import React from 'react'
import type {
	PeriodKey,
	StatsSnapshot,
	SummaryStats,
	DecisionsDistribution,
} from '../../shared/types/stats'
import { fetchStatsSnapshot } from '../../shared/api/statsApi'

export interface UseStatsResult extends StatsSnapshot {
	period: PeriodKey
	setPeriod: (p: PeriodKey) => void
	isLoading: boolean
	error: string | null
}

const DEFAULT_SUMMARY: SummaryStats = {
	checked: 0,
	approvedPercent: 0,
	rejectedPercent: 0,
	avgReviewMinutes: 0,
}

const DEFAULT_DECISIONS: DecisionsDistribution = {
	approved: 0,
	rejected: 0,
	needsChanges: 0,
}

export const useStats = (): UseStatsResult => {
	const [period, setPeriod] = React.useState<PeriodKey>('7d')
	const [snapshot, setSnapshot] = React.useState<StatsSnapshot | null>(null)
	const [isLoading, setIsLoading] = React.useState(false)
	const [error, setError] = React.useState<string | null>(null)

	React.useEffect(() => {
		let cancelled = false

		const load = async () => {
			try {
				setIsLoading(true)
				setError(null)
				const data = await fetchStatsSnapshot(period)
				if (!cancelled) {
					setSnapshot(data)
				}
			} catch (e) {
				console.error(e)
				if (!cancelled) {
					setError('Не удалось загрузить статистику')
					setSnapshot(null)
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false)
				}
			}
		}

		void load()

		return () => {
			cancelled = true
		}
	}, [period])

	const summary = snapshot?.summary ?? DEFAULT_SUMMARY
	const activity = snapshot?.activity ?? []
	const decisions = snapshot?.decisions ?? DEFAULT_DECISIONS
	const categories = snapshot?.categories ?? []

	return {
		period,
		setPeriod,
		isLoading,
		error,
		summary,
		activity,
		decisions,
		categories,
	}
}
