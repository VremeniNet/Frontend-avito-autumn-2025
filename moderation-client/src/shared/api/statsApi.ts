import type { PeriodKey, StatsSnapshot } from '../types/stats'

const STATS_MOCK_BY_PERIOD: Record<PeriodKey, StatsSnapshot> = {
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

export const getStatsSnapshot = (period: PeriodKey): StatsSnapshot =>
	STATS_MOCK_BY_PERIOD[period]
