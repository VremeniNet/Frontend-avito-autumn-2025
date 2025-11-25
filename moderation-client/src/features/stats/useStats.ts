import React from 'react'
import { useQuery } from '@tanstack/react-query'
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

	const { data, isLoading, error } = useQuery<StatsSnapshot, Error>({
		queryKey: ['stats', period],
		queryFn: () => fetchStatsSnapshot(period),
		staleTime: 60_000,
		refetchOnWindowFocus: false,
	})

	const snapshot = data ?? null

	const summary = snapshot?.summary ?? DEFAULT_SUMMARY
	const activity = snapshot?.activity ?? []
	const decisions = snapshot?.decisions ?? DEFAULT_DECISIONS
	const categories = snapshot?.categories ?? []

	return {
		period,
		setPeriod,
		isLoading,
		error: error ? 'Не удалось загрузить статистику' : null,
		summary,
		activity,
		decisions,
		categories,
	}
}
