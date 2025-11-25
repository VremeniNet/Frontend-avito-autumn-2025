import React from 'react'
import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import type { ActivityPoint, PeriodKey } from '../../../shared/types/stats'
import { normalizeToPercent } from '../../../shared/types/stats'

interface StatsActivityChartProps {
	period: PeriodKey
	activity: ActivityPoint[]
}

export const StatsActivityChart: React.FC<StatsActivityChartProps> = ({
	period,
	activity,
}) => {
	const activityMax = Math.max(...activity.map(a => a.value), 0)

	const chipLabel =
		period === 'today'
			? 'по часам'
			: period === '7d'
			? 'последние 7 дней'
			: 'последние 30 дней'

	return (
		<Paper sx={{ p: 2 }}>
			<Stack direction='row' justifyContent='space-between' mb={1}>
				<Typography variant='subtitle1'>График активности за период</Typography>
				<Chip size='small' label={chipLabel} variant='outlined' />
			</Stack>

			<Typography variant='body2' color='text.secondary' mb={2}>
				Показывает, как распределяется нагрузка по времени: когда проверяете
				больше всего объявлений.
			</Typography>

			<Box
				sx={{
					display: 'flex',
					alignItems: 'flex-end',
					gap: 1.5,
					height: 180,
				}}
			>
				{activity.map(point => {
					const height = normalizeToPercent(point.value, activityMax)
					return (
						<Box
							key={point.dayLabel}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'flex-end',
								flex: 1,
								height: '100%',
							}}
						>
							<Box
								sx={{
									width: '100%',
									maxWidth: 32,
									height: `${Math.max(height, 8)}%`,
									borderRadius: 1,
									bgcolor: 'success.main',
									opacity: 0.8,
								}}
							/>
							<Typography
								variant='caption'
								color='text.secondary'
								sx={{ mt: 0.5 }}
							>
								{point.dayLabel}
							</Typography>
						</Box>
					)
				})}
			</Box>
		</Paper>
	)
}
