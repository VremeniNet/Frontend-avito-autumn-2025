import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import type { SummaryStats } from '../../../shared/types/stats'

interface StatsSummaryCardsProps {
	summary: SummaryStats
}

export const StatsSummaryCards: React.FC<StatsSummaryCardsProps> = ({
	summary,
}) => (
	<Box
		sx={{
			display: 'grid',
			gridTemplateColumns: {
				xs: '1fr',
				sm: 'repeat(2, minmax(0, 1fr))',
				md: 'repeat(4, minmax(0, 1fr))',
			},
			gap: 2,
		}}
	>
		<Paper sx={{ p: 2, height: '100%' }}>
			<Typography variant='overline' color='text.secondary'>
				Проверено
			</Typography>
			<Typography variant='h5' sx={{ mt: 0.5 }}>
				{summary.checked}
			</Typography>
			<Typography variant='body2' color='text.secondary'>
				Объявлений за выбранный период
			</Typography>
		</Paper>

		<Paper sx={{ p: 2, height: '100%' }}>
			<Typography variant='overline' color='text.secondary'>
				Одобрено
			</Typography>
			<Typography variant='h5' sx={{ mt: 0.5 }}>
				{summary.approvedPercent}%
			</Typography>
			<Typography variant='body2' color='text.secondary'>
				Доля объявлений, допущенных к публикации
			</Typography>
		</Paper>

		<Paper sx={{ p: 2, height: '100%' }}>
			<Typography variant='overline' color='text.secondary'>
				Отклонено
			</Typography>
			<Typography variant='h5' sx={{ mt: 0.5 }}>
				{summary.rejectedPercent}%
			</Typography>
			<Typography variant='body2' color='text.secondary'>
				Доля объявлений, не прошедших модерацию
			</Typography>
		</Paper>

		<Paper sx={{ p: 2, height: '100%' }}>
			<Typography variant='overline' color='text.secondary'>
				Среднее время
			</Typography>
			<Typography variant='h5' sx={{ mt: 0.5 }}>
				{summary.avgReviewMinutes.toFixed(1)} мин
			</Typography>
			<Typography variant='body2' color='text.secondary'>
				Время на проверку одного объявления
			</Typography>
		</Paper>
	</Box>
)
