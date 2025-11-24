import React from 'react'
import { Paper, Stack, Chip, Typography } from '@mui/material'
import KeyboardIcon from '@mui/icons-material/Keyboard'

export const ListHotkeysHint: React.FC = () => (
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
		<Stack direction='row' spacing={1} flexWrap='wrap'>
			<Stack direction='row' spacing={0.5} alignItems='center'>
				<Chip size='small' label='↑ / ↓' />
				<Typography variant='caption'>перемещение по списку</Typography>
			</Stack>
			<Stack direction='row' spacing={0.5} alignItems='center'>
				<Chip size='small' label='Enter' />
				<Typography variant='caption'>открыть объявление</Typography>
			</Stack>
			<Stack direction='row' spacing={0.5} alignItems='center'>
				<Chip size='small' label='/' />
				<Typography variant='caption'>фокус на поиск</Typography>
			</Stack>
		</Stack>
	</Paper>
)
