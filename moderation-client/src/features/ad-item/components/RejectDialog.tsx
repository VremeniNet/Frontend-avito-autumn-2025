import React from 'react'
import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import {
	REJECT_REASON_LABELS,
	type RejectReasonCode,
} from '../../../shared/types/ads.ts'

interface RejectDialogProps {
	open: boolean
	actionLoading: boolean
	rejectReasons: RejectReasonCode[]
	rejectComment: string
	rejectTouched: boolean
	onClose: () => void
	onToggleReason: (code: RejectReasonCode) => void
	onCommentChange: (value: string) => void
	onConfirm: () => void
}

export const RejectDialog: React.FC<RejectDialogProps> = ({
	open,
	actionLoading,
	rejectReasons,
	rejectComment,
	rejectTouched,
	onClose,
	onToggleReason,
	onCommentChange,
	onConfirm,
}) => {
	const hasError =
		rejectTouched &&
		rejectReasons.length === 0 &&
		rejectComment.trim().length === 0

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Отклонение объявления</DialogTitle>
			<DialogContent>
				<Typography variant='body2' sx={{ mb: 1 }}>
					Укажите причину отклонения. Можно выбрать несколько шаблонов и
					дополнить их собственным комментарием.
				</Typography>

				<Stack spacing={0.5} sx={{ mb: 2 }}>
					<FormControlLabel
						control={
							<Checkbox
								checked={rejectReasons.includes('banned')}
								onChange={() => onToggleReason('banned')}
							/>
						}
						label={REJECT_REASON_LABELS.banned}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={rejectReasons.includes('wrong_category')}
								onChange={() => onToggleReason('wrong_category')}
							/>
						}
						label={REJECT_REASON_LABELS.wrong_category}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={rejectReasons.includes('incorrect_description')}
								onChange={() => onToggleReason('incorrect_description')}
							/>
						}
						label={REJECT_REASON_LABELS.incorrect_description}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={rejectReasons.includes('photo_problems')}
								onChange={() => onToggleReason('photo_problems')}
							/>
						}
						label={REJECT_REASON_LABELS.photo_problems}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={rejectReasons.includes('fraud_suspected')}
								onChange={() => onToggleReason('fraud_suspected')}
							/>
						}
						label={REJECT_REASON_LABELS.fraud_suspected}
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={rejectReasons.includes('other')}
								onChange={() => onToggleReason('other')}
							/>
						}
						label={`${REJECT_REASON_LABELS.other} (см. поле ввода ниже)`}
					/>
				</Stack>

				<TextField
					fullWidth
					multiline
					required
					minRows={3}
					label='Комментарий для продавца'
					placeholder='Опишите, что именно нужно исправить или почему объявление не может быть опубликовано.'
					value={rejectComment}
					onChange={e => onCommentChange(e.target.value)}
					error={hasError}
					helperText={
						hasError
							? 'Укажите хотя бы одну причину или напишите комментарий'
							: 'Причина отклонения обязательна'
					}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Отмена</Button>
				<Button
					onClick={onConfirm}
					variant='contained'
					color='error'
					disabled={actionLoading}
				>
					Отклонить
				</Button>
			</DialogActions>
		</Dialog>
	)
}
