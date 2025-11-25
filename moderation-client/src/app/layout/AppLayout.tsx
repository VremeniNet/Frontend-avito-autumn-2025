import React from 'react'
import {
	AppBar,
	Toolbar,
	Typography,
	Container,
	Box,
	Button,
	IconButton,
	Tooltip,
	Stack,
	useTheme,
} from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import ListAltIcon from '@mui/icons-material/ListAlt'
import AssessmentIcon from '@mui/icons-material/Assessment'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { ColorModeContext } from '../../app/theme.ts'

type Props = {
	children: React.ReactNode
}

export const AppLayout: React.FC<Props> = ({ children }) => {
	const theme = useTheme()
	const location = useLocation()
	const colorMode = React.useContext(ColorModeContext)

	const isList = location.pathname.startsWith('/list')
	const isStats = location.pathname.startsWith('/stats')

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: 'background.default',
				color: 'text.primary',
			}}
		>
			<AppBar
				position='sticky'
				elevation={0}
				color='transparent'
				sx={{
					borderBottom: theme => `1px solid ${theme.palette.divider}`,
					backdropFilter: 'blur(16px)',
					bgcolor:
						theme.palette.mode === 'light'
							? 'rgba(255,255,255,0.9)'
							: 'rgba(3,7,18,0.9)',
				}}
			>
				<Toolbar sx={{ gap: 2 }}>
					<Typography variant='h6' sx={{ fontWeight: 700 }}>
						Avito Moderation
					</Typography>

					<Stack
						direction='row'
						spacing={1}
						sx={{ ml: 4, display: { xs: 'none', sm: 'flex' } }}
					>
						<Button
							component={RouterLink}
							to='/list'
							color={isList ? 'primary' : 'inherit'}
							startIcon={<ListAltIcon />}
						>
							Queue
						</Button>
						<Button
							component={RouterLink}
							to='/stats'
							color={isStats ? 'primary' : 'inherit'}
							startIcon={<AssessmentIcon />}
						>
							Stats
						</Button>
					</Stack>

					<Box sx={{ flexGrow: 1 }} />

					<Tooltip
						title={
							theme.palette.mode === 'light'
								? 'Включить тёмную тему'
								: 'Выключить тёмную тему'
						}
					>
						<IconButton
							onClick={colorMode.toggleColorMode}
							sx={{
								borderRadius: 999,
								border: `1px solid ${theme.palette.divider}`,
							}}
						>
							{theme.palette.mode === 'light' ? (
								<DarkModeIcon fontSize='small' />
							) : (
								<LightModeIcon fontSize='small' />
							)}
						</IconButton>
					</Tooltip>
				</Toolbar>
			</AppBar>

			<Container maxWidth='xl' sx={{ py: 3 }}>
				{children}
			</Container>
		</Box>
	)
}
