import React from 'react'
import type { PeriodKey, StatsSnapshot } from '../../shared/types/stats'
import { getStatsSnapshot } from '../../shared/api/statsApi'

export interface UseStatsResult extends StatsSnapshot {
	period: PeriodKey
	setPeriod: (p: PeriodKey) => void
}

export const useStats = (): UseStatsResult => {
	const [period, setPeriod] = React.useState<PeriodKey>('7d')

	const data: StatsSnapshot = React.useMemo(
		() => getStatsSnapshot(period),
		[period]
	)

	return {
		period,
		setPeriod,
		...data,
	}
}
