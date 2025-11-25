import React from 'react'
import { Box, Alert, Stack, Button, Tooltip } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate, useParams } from 'react-router-dom'

import { useAdItem } from '../features/ad-item/useAdItem.ts'
import { AdItemHeader } from '../features/ad-item/components/AdItemHeader.tsx'
import { AdItemMainContent } from '../features/ad-item/components/AdItemMainContent.tsx'
import { AdItemDecisionPanel } from '../features/ad-item/components/AdItemDecisionPanel.tsx'
import { RejectDialog } from '../features/ad-item/components/RejectDialog.tsx'

export const ItemPage: React.FC = () => {
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()

	const adId = Number(id)
	const {
		ad,
		history,
		loading,
		historyLoading,
		error,
		setError,
		actionLoading,
		activeImageIndex,
		setActiveImageIndex,
		rejectDialogOpen,
		rejectReasons,
		rejectComment,
		rejectTouched,
		setRejectComment,
		toggleRejectReason,
		openRejectDialog,
		closeRejectDialog,
		confirmReject,
		approve,
		requestChanges,
		reloadHistory,
	} = useAdItem(Number.isFinite(adId) ? adId : null)

	React.useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null
			const tag = target?.tagName
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
				return
			}

			if (event.key === 'Escape' && rejectDialogOpen) {
				event.preventDefault()
				closeRejectDialog()
				return
			}

			if (!ad) return

			switch (event.key) {
				case 'a':
				case 'A':
					event.preventDefault()
					void approve()
					break
				case 'd':
				case 'D':
					event.preventDefault()
					openRejectDialog()
					break
				case 'Backspace':
					event.preventDefault()
					navigate('/list')
					break
				default:
					break
			}
		}

		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [
		ad,
		approve,
		navigate,
		openRejectDialog,
		closeRejectDialog,
		rejectDialogOpen,
	])

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
			{error && (
				<Alert severity='error' onClose={() => setError(null)} sx={{ mb: 1 }}>
					{error}
				</Alert>
			)}

			<AdItemHeader
				adId={adId}
				ad={ad}
				onBackToList={() => navigate('/list')}
			/>

			<AdItemMainContent
				ad={ad}
				history={history}
				historyLoading={historyLoading}
				loading={loading}
				activeImageIndex={activeImageIndex}
				onImageChange={setActiveImageIndex}
				onReloadHistory={() => void reloadHistory()}
			/>

			<AdItemDecisionPanel
				ad={ad}
				actionLoading={actionLoading}
				onApprove={() => void approve()}
				onRejectOpen={openRejectDialog}
				onRequestChanges={() => void requestChanges()}
			/>

			<Stack direction='row' justifyContent='space-between' alignItems='center'>
				<Button
					startIcon={<ArrowBackIosNewIcon />}
					variant='text'
					onClick={() => navigate('/list')}
				>
					К списку объявлений
				</Button>

				<Stack direction='row' spacing={1}>
					<Tooltip title='Предыдущее объявление по ID'>
						<span>
							<Button
								variant='outlined'
								size='small'
								startIcon={<ArrowBackIosNewIcon fontSize='small' />}
								disabled={!Number.isFinite(adId) || adId <= 1}
								onClick={() => navigate(`/item/${adId - 1}`)}
							>
								Предыдущее
							</Button>
						</span>
					</Tooltip>
					<Tooltip title='Следующее объявление по ID'>
						<span>
							<Button
								variant='outlined'
								size='small'
								endIcon={<ArrowForwardIosIcon fontSize='small' />}
								disabled={!Number.isFinite(adId)}
								onClick={() => navigate(`/item/${adId + 1}`)}
							>
								Следующее
							</Button>
						</span>
					</Tooltip>
				</Stack>
			</Stack>

			<RejectDialog
				open={rejectDialogOpen}
				actionLoading={actionLoading}
				rejectReasons={rejectReasons}
				rejectComment={rejectComment}
				rejectTouched={rejectTouched}
				onClose={closeRejectDialog}
				onToggleReason={toggleRejectReason}
				onCommentChange={setRejectComment}
				onConfirm={() => void confirmReject()}
			/>
		</Box>
	)
}
