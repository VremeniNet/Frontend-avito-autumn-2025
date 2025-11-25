import React from 'react'
import {
	Paper,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'
import type { PeriodKey } from '../../../shared/types/stats'

interface StatsPeriodControlsProps {
	period: PeriodKey
	onChange: (period: PeriodKey) => void
}

export const StatsPeriodControls: React.FC<StatsPeriodControlsProps> = ({
	period,
	onChange,
}) => {
	const handleChange = (
		_: React.MouseEvent<HTMLElement>,
		value: PeriodKey | null
	) => {
		if (value) {
			onChange(value)
		}
	}

	return (
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
				onChange={handleChange}
				size='small'
				color='primary'
			>
				<ToggleButton value='today'>Сегодня</ToggleButton>
				<ToggleButton value='7d'>7 дней</ToggleButton>
				<ToggleButton value='30d'>30 дней</ToggleButton>
			</ToggleButtonGroup>
		</Paper>
	)
}
