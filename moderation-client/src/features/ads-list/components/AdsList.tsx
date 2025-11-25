import React from 'react'
import {
	Avatar,
	Box,
	Button,
	Card,
	Chip,
	Grow,
	Stack,
	Typography,
	useTheme,
} from '@mui/material'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import BoltIcon from '@mui/icons-material/Bolt'

import {
	STATUS_LABELS,
	type Advertisement,
	type ModerationStatus,
} from '../../../shared/types/ads'

interface AdsListProps {
	ads: Advertisement[]
	selectedIndex: number
	onSelect?: (index: number) => void
	onOpen: (index: number) => void
}

const statusChipColor = (
	s: ModerationStatus
): 'default' | 'success' | 'error' | 'warning' => {
	switch (s) {
		case 'approved':
			return 'success'
		case 'rejected':
			return 'error'
		case 'draft':
			return 'default'
		case 'pending':
		default:
			return 'warning'
	}
}

export const AdsList: React.FC<AdsListProps> = ({
	ads,
	selectedIndex,
	onSelect,
	onOpen,
}) => {
	const theme = useTheme()

	const handleCardClick = (index: number) => {
		onSelect?.(index)
		onOpen(index)
	}

	return (
		<Stack spacing={1.5}>
			{ads.map((ad, index) => (
				<Grow
					in
					timeout={300 + index * 40}
					key={ad.id}
					style={{ transformOrigin: 'left center' }}
				>
					<Card
						sx={{
							borderWidth: index === selectedIndex ? 2 : 1,
							borderColor:
								index === selectedIndex
									? theme.palette.primary.main
									: 'divider',
							transition: 'transform 0.15s ease, box-shadow 0.15s ease',
							cursor: 'pointer',
							'&:hover': {
								transform: 'translateY(-2px)',
								boxShadow: theme.shadows[4],
							},
						}}
						onClick={() => handleCardClick(index)}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'stretch',
								p: 1.5,
								gap: 2,
							}}
						>
							<Box
								sx={{
									width: 64,
									height: 64,
									borderRadius: 2,
									bgcolor: 'grey.100',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									overflow: 'hidden',
								}}
							>
								<Avatar sx={{ bgcolor: 'primary.main' }}>
									{ad.title.charAt(0).toUpperCase()}
								</Avatar>
							</Box>

							<Box sx={{ flex: 1, minWidth: 0 }}>
								<Typography variant='subtitle1' noWrap>
									{ad.title}
								</Typography>

								<Stack
									direction='row'
									spacing={1}
									alignItems='center'
									sx={{ mt: 0.5, mb: 0.5 }}
									flexWrap='wrap'
								>
									<Typography variant='subtitle1' fontWeight={600}>
										{ad.price.toLocaleString('ru-RU')} ₽
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										· {ad.category}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										· {new Date(ad.createdAt).toLocaleDateString('ru-RU')}
									</Typography>
								</Stack>

								<Stack direction='row' spacing={1} flexWrap='wrap'>
									<Chip
										size='small'
										label={STATUS_LABELS[ad.status]}
										color={statusChipColor(ad.status)}
									/>
									{ad.priority === 'urgent' && (
										<Chip
											size='small'
											color='secondary'
											icon={<BoltIcon />}
											label='urgent'
										/>
									)}
								</Stack>
							</Box>

							<Box
								sx={{ display: 'flex', alignItems: 'center' }}
								onClick={e => e.stopPropagation()}
							>
								<Button
									variant='contained'
									size='small'
									endIcon={<ArrowForwardIosIcon fontSize='inherit' />}
									onClick={() => onOpen(index)}
								>
									Открыть
								</Button>
							</Box>
						</Box>
					</Card>
				</Grow>
			))}

			{ads.length === 0 && (
				<Typography variant='body2' color='text.secondary'>
					Нет объявлений по текущим фильтрам.
				</Typography>
			)}
		</Stack>
	)
}
