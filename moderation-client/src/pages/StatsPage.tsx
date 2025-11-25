import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

import { useStats } from '../features/stats/useStats'
import { StatsHotkeysHint } from '../features/stats/components/StatsHotkeysHint'
import { StatsPeriodControls } from '../features/stats/components/StatsPeriodControls'
import { StatsSummaryCards } from '../features/stats/components/StatsSummaryCards'
import { StatsActivityChart } from '../features/stats/components/StatsActivityChart'
import { StatsDecisionsAndCategories } from '../features/stats/components/StatsDecisionsAndCategories'

export const StatsPage: React.FC = () => {
	const navigate = useNavigate()
	const { period, setPeriod, summary, activity, decisions, categories } =
		useStats()

	React.useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null
			const tag = target?.tagName

			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
				return
			}

			if (
				event.key === 'Backspace' &&
				!event.altKey &&
				!event.ctrlKey &&
				!event.metaKey
			) {
				event.preventDefault()
				navigate('/list')
			}
		}

		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [navigate])

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: { xs: 'flex-start', sm: 'center' },
					gap: 2,
					flexWrap: 'wrap',
				}}
			>
				<Box>
					<Typography variant='h4' gutterBottom>
						Статистика модератора
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						Следите за динамикой своей работы: количество проверок,
						распределение решений и активности по категориям.
					</Typography>
				</Box>

				<StatsHotkeysHint />
			</Box>

			<StatsPeriodControls period={period} onChange={setPeriod} />

			<StatsSummaryCards summary={summary} />

			<StatsActivityChart period={period} activity={activity} />

			<StatsDecisionsAndCategories
				decisions={decisions}
				categories={categories}
			/>
		</Box>
	)
}
