import React from 'react'
import { Chip, Paper, Stack, Typography } from '@mui/material'
import KeyboardIcon from '@mui/icons-material/Keyboard'

export const StatsHotkeysHint: React.FC = () => (
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
