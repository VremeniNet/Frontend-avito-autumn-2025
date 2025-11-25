import React from 'react'
import { Box, Chip, IconButton, Paper, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import BoltIcon from '@mui/icons-material/Bolt'
import {
	type AdvertisementDetails,
	PRIORITY_LABELS,
	STATUS_LABELS,
	formatDateTime,
	statusChipColor,
} from '../../../shared/types/ads.ts'

interface AdItemHeaderProps {
	adId: number
	ad: AdvertisementDetails | null
	onBackToList: () => void
}

export const AdItemHeader: React.FC<AdItemHeaderProps> = ({
	adId,
	ad,
	onBackToList,
}) => {
	return (
		<Stack
			direction={{ xs: 'column', md: 'row' }}
			spacing={2}
			alignItems={{ xs: 'flex-start', md: 'center' }}
			justifyContent='space-between'
		>
			<Stack direction='row' spacing={1.5} alignItems='center'>
				<IconButton aria-label='Вернуться к списку' onClick={onBackToList}>
					<ArrowBackIcon />
				</IconButton>

				<Box>
					<Typography variant='h5' gutterBottom>
						{ad ? `${ad.title}` : adId ? `Объявление ${adId}` : 'Объявление'}
					</Typography>

					{ad && (
						<Stack direction='row' spacing={1} flexWrap='wrap'>
							<Chip
								size='small'
								color={statusChipColor(ad.status)}
								label={STATUS_LABELS[ad.status]}
							/>
							<Chip
								size='small'
								variant='outlined'
								icon={ad.priority === 'urgent' ? <BoltIcon /> : undefined}
								label={PRIORITY_LABELS[ad.priority]}
							/>
							<Typography variant='caption' color='text.secondary'>
								Создано: {formatDateTime(ad.createdAt)}
								{ad.updatedAt &&
									` · обновлено: ${formatDateTime(ad.updatedAt)}`}
							</Typography>
						</Stack>
					)}
				</Box>
			</Stack>

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
						<Chip size='small' label='A' />
						<Typography variant='caption'>одобрить</Typography>
					</Stack>
					<Stack direction='row' spacing={0.5} alignItems='center'>
						<Chip size='small' label='D' />
						<Typography variant='caption'>отклонить</Typography>
					</Stack>
					<Stack direction='row' spacing={0.5} alignItems='center'>
						<Chip size='small' label='Backspace' />
						<Typography variant='caption'>назад к списку</Typography>
					</Stack>
				</Stack>
			</Paper>
		</Stack>
	)
}
