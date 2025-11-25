import React from 'react'
import { Button, Paper, Stack, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EditNoteIcon from '@mui/icons-material/EditNote'
import type { AdvertisementDetails } from '../../../shared/types/ads.ts'

interface AdItemDecisionPanelProps {
	ad: AdvertisementDetails | null
	actionLoading: boolean
	onApprove: () => void
	onRejectOpen: () => void
	onRequestChanges: () => void
}

export const AdItemDecisionPanel: React.FC<AdItemDecisionPanelProps> = ({
	ad,
	actionLoading,
	onApprove,
	onRejectOpen,
	onRequestChanges,
}) => (
	<Paper
		sx={{
			p: 2,
			display: 'flex',
			flexDirection: { xs: 'column', md: 'row' },
			alignItems: { xs: 'stretch', md: 'center' },
			justifyContent: 'space-between',
			gap: 1.5,
		}}
	>
		<Typography variant='subtitle1'>Примите решение по объявлению</Typography>

		<Stack
			direction={{ xs: 'column', sm: 'row' }}
			spacing={1.5}
			alignItems={{ xs: 'stretch', sm: 'center' }}
		>
			<Button
				variant='contained'
				color='success'
				startIcon={<CheckCircleIcon />}
				disabled={!ad || actionLoading}
				onClick={onApprove}
			>
				Одобрить
			</Button>

			<Button
				variant='contained'
				color='error'
				startIcon={<CancelIcon />}
				disabled={!ad || actionLoading}
				onClick={onRejectOpen}
			>
				Отклонить
			</Button>

			<Button
				variant='outlined'
				color='warning'
				startIcon={<EditNoteIcon />}
				disabled={!ad || actionLoading}
				onClick={onRequestChanges}
			>
				На доработку
			</Button>
		</Stack>
	</Paper>
)
