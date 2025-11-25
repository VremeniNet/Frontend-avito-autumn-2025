import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Box,
	Chip,
	Divider,
	Paper,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'
import KeyboardIcon from '@mui/icons-material/Keyboard'

type PeriodKey = 'today' | '7d' | '30d' | 'custom'
type PeriodWithData = Exclude<PeriodKey, 'custom'>

interface PeriodData {
	summary: SummaryStats
	activity: ActivityPoint[]
	decisions: DecisionsDistribution
	categories: CategoryStat[]
}

interface SummaryStats {
	checked: number
	approvedPercent: number
	rejectedPercent: number
	avgReviewMinutes: number
}

interface ActivityPoint {
	dayLabel: string
	value: number
}

interface DecisionsDistribution {
	approved: number
	rejected: number
	needsChanges: number
}

interface CategoryStat {
	category: string
	value: number
}

const mockDataByPeriod: Record<PeriodWithData, PeriodData> = {
	today: {
		summary: {
			checked: 27,
			approvedPercent: 74,
			rejectedPercent: 18,
			avgReviewMinutes: 2.3,
		},
		activity: [
			{ dayLabel: '09:00', value: 2 },
			{ dayLabel: '10:00', value: 3 },
			{ dayLabel: '11:00', value: 5 },
			{ dayLabel: '12:00', value: 4 },
			{ dayLabel: '13:00', value: 6 },
			{ dayLabel: '14:00', value: 3 },
			{ dayLabel: '15:00', value: 4 },
		],
		decisions: {
			approved: 74,
			rejected: 18,
			needsChanges: 8,
		},
		categories: [
			{ category: 'Недвижимость', value: 9 },
			{ category: 'Авто', value: 6 },
			{ category: 'Услуги', value: 5 },
			{ category: 'Электроника', value: 4 },
			{ category: 'Другое', value: 3 },
		],
	},
	'7d': {
		summary: {
			checked: 243,
			approvedPercent: 78,
			rejectedPercent: 15,
			avgReviewMinutes: 2.9,
		},
		activity: [
			{ dayLabel: 'Пн', value: 34 },
			{ dayLabel: 'Вт', value: 41 },
			{ dayLabel: 'Ср', value: 39 },
			{ dayLabel: 'Чт', value: 36 },
			{ dayLabel: 'Пт', value: 48 },
			{ dayLabel: 'Сб', value: 27 },
			{ dayLabel: 'Вс', value: 18 },
		],
		decisions: {
			approved: 78,
			rejected: 15,
			needsChanges: 7,
		},
		categories: [
			{ category: 'Недвижимость', value: 72 },
			{ category: 'Авто', value: 51 },
			{ category: 'Услуги', value: 43 },
			{ category: 'Электроника', value: 38 },
			{ category: 'Другое', value: 39 },
		],
	},
	'30d': {
		summary: {
			checked: 982,
			approvedPercent: 81,
			rejectedPercent: 13,
			avgReviewMinutes: 3.1,
		},
		activity: [
			{ dayLabel: '1', value: 28 },
			{ dayLabel: '7', value: 33 },
			{ dayLabel: '14', value: 36 },
			{ dayLabel: '21', value: 31 },
			{ dayLabel: '28', value: 40 },
			{ dayLabel: '29', value: 38 },
			{ dayLabel: '30', value: 35 },
		],
		decisions: {
			approved: 81,
			rejected: 13,
			needsChanges: 6,
		},
		categories: [
			{ category: 'Недвижимость', value: 310 },
			{ category: 'Авто', value: 214 },
			{ category: 'Услуги', value: 188 },
			{ category: 'Электроника', value: 142 },
			{ category: 'Другое', value: 128 },
		],
	},
}
const StatsHotkeysHint: React.FC = () => (
	<Paper
		sx={{
			px: 2,
			py: 1.5,
			display: 'flex',
			alignItems: 'center',
			gap: 1.5,
			borderRadius: 999,
		}}
	>
		<KeyboardIcon fontSize='small' color='primary' />
		<Stack direction='row' spacing={1.5}>
			<Stack direction='row' spacing={0.5} alignItems='center'>
				<Chip size='small' label='Backspace' />
				<Typography variant='caption'>назад к списку</Typography>
			</Stack>
		</Stack>
	</Paper>
)

// простая функция для «нормирования» значений для баров 0–100%
const normalize = (value: number, max: number) =>
	max === 0 ? 0 : Math.round((value / max) * 100)

export const StatsPage: React.FC = () => {
	const navigate = useNavigate()
	const [period, setPeriod] = React.useState<PeriodKey>('7d')
	React.useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null
			const tag = target?.tagName

			// не трогаем, если человек печатает в инпутах
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
				return
			}

			// Backspace — возврат к списку
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

	const handlePeriodChange = (
		_: React.MouseEvent<HTMLElement>,
		value: PeriodKey | null
	) => {
		if (value) {
			setPeriod(value)
		}
	}

	const periodForData: PeriodWithData = period === 'custom' ? '7d' : period
	const data = mockDataByPeriod[periodForData]

	const { summary, activity, decisions, categories } = data

	const activityMax = Math.max(...activity.map(a => a.value), 0)
	const categoriesMax = Math.max(...categories.map(c => c.value), 0)

	const totalDecisionPercent =
		decisions.approved + decisions.rejected + decisions.needsChanges || 1

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

			{/* Переключатель периода */}
			<Paper
				sx={{
					p: 2,
					display: 'flex',
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: { xs: 'stretch', sm: 'center' },
					justifyContent: 'space-between',
					gap: 2,
				}}
			>
				<Stack spacing={0.5}>
					<Typography variant='subtitle1'>Период</Typography>
					<Typography variant='body2' color='text.secondary'>
						Базовая аналитика доступна за сегодня, 7 и 30 дней.
					</Typography>
				</Stack>

				<ToggleButtonGroup
					value={period}
					exclusive
					onChange={handlePeriodChange}
					size='small'
					color='primary'
				>
					<ToggleButton value='today'>Сегодня</ToggleButton>
					<ToggleButton value='7d'>7 дней</ToggleButton>
					<ToggleButton value='30d'>30 дней</ToggleButton>
				</ToggleButtonGroup>
			</Paper>

			{/* Карточки метрик */}
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

			{/* График активности (барчики) */}
			<Paper sx={{ p: 2 }}>
				<Stack direction='row' justifyContent='space-between' mb={1}>
					<Typography variant='subtitle1'>
						График активности за период
					</Typography>
					<Chip
						size='small'
						label={
							period === 'today'
								? 'по часам'
								: period === '7d'
								? 'последние 7 дней'
								: 'последние 30 дней'
						}
						variant='outlined'
					/>
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
						const height = normalize(point.value, activityMax)
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

			{/* Две диаграммы: распределение решений + категории */}
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
							const width = normalize(cat.value, categoriesMax)
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

			<Divider sx={{ mt: 2 }} />
			<Typography variant='caption' color='text.secondary'>
				В дальнейшем здесь можно подключить реальные данные из API и добавить
				фильтрацию по сегментам (тип модерации, платформа, очередь).
			</Typography>
		</Box>
	)
}
