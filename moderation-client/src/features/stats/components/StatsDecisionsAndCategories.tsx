import React from 'react'
import { Box, Paper, Stack, Typography } from '@mui/material'
import type {
	CategoryStat,
	DecisionsDistribution,
} from '../../../shared/types/stats'
import { normalizeToPercent } from '../../../shared/types/stats'

interface StatsDecisionsAndCategoriesProps {
	decisions: DecisionsDistribution
	categories: CategoryStat[]
}

export const StatsDecisionsAndCategories: React.FC<
	StatsDecisionsAndCategoriesProps
> = ({ decisions, categories }) => {
	const categoriesMax = Math.max(...categories.map(c => c.value), 0)
	const totalDecisionPercent =
		decisions.approved + decisions.rejected + decisions.needsChanges || 1

	return (
		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
				gap: 2,
			}}
		>
			<Paper sx={{ p: 2, height: '100%' }}>
				<Typography variant='subtitle1' gutterBottom>
					Распределение решений
				</Typography>
				<Typography variant='body2' color='text.secondary' mb={2}>
					Процент одобренных, отклонённых и отправленных на доработку
					объявлений.
				</Typography>

				<Box
					sx={{
						display: 'flex',
						width: '100%',
						height: 32,
						borderRadius: 999,
						overflow: 'hidden',
						mb: 1.5,
						bgcolor: 'grey.100',
					}}
				>
					<Box
						sx={{
							flex: decisions.approved / totalDecisionPercent || 0,
							bgcolor: 'success.main',
						}}
					/>
					<Box
						sx={{
							flex: decisions.rejected / totalDecisionPercent || 0,
							bgcolor: 'error.main',
						}}
					/>
					<Box
						sx={{
							flex: decisions.needsChanges / totalDecisionPercent || 0,
							bgcolor: 'warning.main',
						}}
					/>
				</Box>

				<Stack direction='row' spacing={2} flexWrap='wrap'>
					<Stack direction='row' spacing={1} alignItems='center'>
						<Box
							sx={{
								width: 12,
								height: 12,
								borderRadius: '50%',
								bgcolor: 'success.main',
							}}
						/>
						<Typography variant='caption'>
							Одобрено — {decisions.approved}%
						</Typography>
					</Stack>
					<Stack direction='row' spacing={1} alignItems='center'>
						<Box
							sx={{
								width: 12,
								height: 12,
								borderRadius: '50%',
								bgcolor: 'error.main',
							}}
						/>
						<Typography variant='caption'>
							Отклонено — {decisions.rejected}%
						</Typography>
					</Stack>
					<Stack direction='row' spacing={1} alignItems='center'>
						<Box
							sx={{
								width: 12,
								height: 12,
								borderRadius: '50%',
								bgcolor: 'warning.main',
							}}
						/>
						<Typography variant='caption'>
							На доработку — {decisions.needsChanges}%
						</Typography>
					</Stack>
				</Stack>
			</Paper>

			<Paper sx={{ p: 2, height: '100%' }}>
				<Typography variant='subtitle1' gutterBottom>
					Категории проверенных объявлений
				</Typography>
				<Typography variant='body2' color='text.secondary' mb={2}>
					Показывает, с какими категориями вы работаете чаще всего.
				</Typography>

				<Stack spacing={1.5}>
					{categories.map(cat => {
						const width = normalizeToPercent(cat.value, categoriesMax)
						return (
							<Box key={cat.category}>
								<Stack
									direction='row'
									justifyContent='space-between'
									alignItems='center'
									mb={0.5}
								>
									<Typography variant='body2'>{cat.category}</Typography>
									<Typography variant='caption' color='text.secondary'>
										{cat.value} объявл.
									</Typography>
								</Stack>
								<Box
									sx={{
										width: '100%',
										height: 10,
										borderRadius: 999,
										bgcolor: 'grey.200',
										overflow: 'hidden',
									}}
								>
									<Box
										sx={{
											width: `${Math.max(width, 8)}%`,
											height: '100%',
											bgcolor: 'primary.main',
										}}
									/>
								</Box>
							</Box>
						)
					})}
				</Stack>
			</Paper>
		</Box>
	)
}
