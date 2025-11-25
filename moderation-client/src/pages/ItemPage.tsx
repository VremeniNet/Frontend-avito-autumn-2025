import React from 'react'
import axios from 'axios'
import {
	Alert,
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel,
	Checkbox,
	IconButton,
	LinearProgress,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Paper,
	Stack,
	TextField,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EditNoteIcon from '@mui/icons-material/EditNote'
import HistoryIcon from '@mui/icons-material/History'
import ImageIcon from '@mui/icons-material/Image'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import BoltIcon from '@mui/icons-material/Bolt'
import PersonIcon from '@mui/icons-material/Person'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import { useNavigate, useParams } from 'react-router-dom'

type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'draft'
type Priority = 'normal' | 'urgent'

type ModerationAction = 'created' | 'approved' | 'rejected' | 'requestChanges'

type RejectReasonCode =
	| 'banned'
	| 'wrong_category'
	| 'incorrect_description'
	| 'photo_problems'
	| 'fraud_suspected'
	| 'other'

interface Seller {
	id: number
	name: string
	rating?: number
	city?: string
	totalAds?: number
	registeredAt?: string
}

interface AdAttribute {
	name: string
	value: string
}

interface AdStats {
	views: number
	favorites: number
	complaints: number
}

interface ModerationHistoryItem {
	id: number
	adId: number
	action: ModerationAction
	moderatorName: string
	reason?: string | null
	comment?: string | null
	timestamp: string
}

interface AdvertisementDetails {
	id: number
	title: string
	description: string
	price: number
	category: string
	categoryId?: number
	status: ModerationStatus
	priority: Priority
	createdAt: string
	updatedAt?: string
	images?: string[]
	seller?: Seller
	attributes?: AdAttribute[]
	stats?: AdStats
	moderationHistory?: ModerationHistoryItem[]
}

const STATUS_LABELS: Record<ModerationStatus, string> = {
	pending: 'На модерации',
	approved: 'Одобрено',
	rejected: 'Отклонено',
	draft: 'Черновик',
}

const PRIORITY_LABELS: Record<Priority, string> = {
	normal: 'Обычное',
	urgent: 'Срочное',
}

const ACTION_LABELS: Record<ModerationAction, string> = {
	created: 'Создано',
	approved: 'Одобрено',
	rejected: 'Отклонено',
	requestChanges: 'Запрошены правки',
}

const REJECT_REASON_LABELS: Record<RejectReasonCode, string> = {
	banned: 'Запрещённый товар',
	wrong_category: 'Неверная категория',
	incorrect_description: 'Некорректное описание',
	photo_problems: 'Проблемы с фото',
	fraud_suspected: 'Подозрение на мошенничество',
	other: 'Другое',
}

export const ItemPage: React.FC = () => {
	const theme = useTheme()
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()

	const adId = Number(id)

	const [ad, setAd] = React.useState<AdvertisementDetails | null>(null)
	const [history, setHistory] = React.useState<ModerationHistoryItem[]>([])
	const [loading, setLoading] = React.useState(false)
	const [historyLoading, setHistoryLoading] = React.useState(false)
	const [error, setError] = React.useState<string | null>(null)
	const [actionLoading, setActionLoading] = React.useState(false)

	const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false)
	const [rejectReasons, setRejectReasons] = React.useState<RejectReasonCode[]>(
		[]
	)
	const [rejectComment, setRejectComment] = React.useState('')
	const [rejectTouched, setRejectTouched] = React.useState(false)

	const toggleRejectReason = (code: RejectReasonCode) => {
		setRejectReasons(prev =>
			prev.includes(code) ? prev.filter(r => r !== code) : [...prev, code]
		)
	}

	const [activeImageIndex, setActiveImageIndex] = React.useState(0)

	const loadAd = React.useCallback(async () => {
		if (!Number.isFinite(adId)) {
			setError('Некорректный идентификатор объявления')
			return
		}

		setLoading(true)
		setError(null)

		try {
			const response = await axios.get<AdvertisementDetails>(
				`/api/v1/ads/${adId}`
			)
			setAd(response.data)
			setActiveImageIndex(0)
		} catch (err) {
			console.error(err)
			setError('Не удалось загрузить объявление. Попробуйте позже.')
		} finally {
			setLoading(false)
		}
	}, [adId])

	const loadHistory = React.useCallback(async () => {
		if (!Number.isFinite(adId)) {
			return
		}

		setHistoryLoading(true)
		try {
			const response = await axios.get<AdvertisementDetails>(
				`/api/v1/ads/${adId}`
			)

			const moderationHistory = response.data.moderationHistory ?? []

			const sorted = [...moderationHistory].sort(
				(a, b) =>
					new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
			)

			setHistory(sorted)
		} catch (err) {
			console.error(err)
		} finally {
			setHistoryLoading(false)
		}
	}, [adId])

	React.useEffect(() => {
		void loadAd()
		void loadHistory()
	}, [loadAd, loadHistory])

	const statusChipColor = (s: ModerationStatus) => {
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

	const handleApprove = React.useCallback(async () => {
		if (!ad || actionLoading) return
		setActionLoading(true)
		setError(null)

		try {
			await axios.post(`/api/v1/ads/${ad.id}/approve`)
			setAd(prev => (prev ? { ...prev, status: 'approved' } : prev))
			void loadHistory()
		} catch (err) {
			console.error(err)
			setError('Не удалось одобрить объявление. Попробуйте ещё раз.')
		} finally {
			setActionLoading(false)
		}
	}, [ad, actionLoading, loadHistory])

	const handleOpenRejectDialog = () => {
		setRejectDialogOpen(true)
	}

	const handleCloseRejectDialog = () => {
		setRejectDialogOpen(false)
		setRejectTouched(false)
	}

	const handleConfirmReject = async () => {
		if (!ad || actionLoading) return

		const trimmedComment = rejectComment.trim()
		const hasText = trimmedComment.length > 0

		if (rejectReasons.length === 0 && !hasText) {
			setRejectTouched(true)
			return
		}

		const primaryReason: RejectReasonCode = rejectReasons[0] ?? 'other'

		const commentToSend = hasText
			? trimmedComment
			: rejectReasons.map(code => REJECT_REASON_LABELS[code]).join(', ')

		setActionLoading(true)
		setError(null)

		try {
			await axios.post(`/api/v1/ads/${ad.id}/reject`, {
				reason: REJECT_REASON_LABELS[primaryReason],
				comment: commentToSend || undefined,
			})

			setAd(prev => (prev ? { ...prev, status: 'rejected' } : prev))
			setRejectDialogOpen(false)
			setRejectComment('')
			setRejectReasons([])
			setRejectTouched(false)
			void loadHistory()
		} catch (err) {
			console.error(err)
			setError('Не удалось отклонить объявление. Попробуйте ещё раз.')
		} finally {
			setActionLoading(false)
		}
	}

	const handleRequestChanges = React.useCallback(async () => {
		if (!ad || actionLoading) return

		const comment =
			rejectComment ||
			'Пожалуйста, уточните описание и корректно заполните характеристики.'

		setActionLoading(true)
		setError(null)

		try {
			await axios.post(`/api/v1/ads/${ad.id}/request-changes`, {
				comment,
			})

			setAd(prev => (prev ? { ...prev, status: 'pending' } : prev))
			setRejectComment('')
			void loadHistory()
		} catch (err) {
			console.error(err)
			setError('Не удалось отправить объявление на доработку.')
		} finally {
			setActionLoading(false)
		}
	}, [ad, actionLoading, rejectComment, loadHistory])

	// горячие клавиши
	React.useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null
			const tag = target?.tagName
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
				return
			}

			if (event.key === 'Escape' && rejectDialogOpen) {
				event.preventDefault()
				handleCloseRejectDialog()
				return
			}

			if (!ad) return

			switch (event.key) {
				case 'a':
				case 'A':
					event.preventDefault()
					void handleApprove()
					break
				case 'd':
				case 'D':
					event.preventDefault()
					handleOpenRejectDialog()
					break
				case 'Backspace':
					event.preventDefault()
					navigate(-1)
					break
				default:
					break
			}
		}

		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [ad, handleApprove, navigate, rejectDialogOpen])

	const formatDateTime = (value?: string) => {
		if (!value) return '—'
		return new Date(value).toLocaleString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const images = ad?.images && ad.images.length > 0 ? ad.images : null
	const activeImage =
		images && images.length > 0
			? images[Math.min(activeImageIndex, images.length - 1)]
			: null

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
			{error && (
				<Alert severity='error' onClose={() => setError(null)} sx={{ mb: 1 }}>
					{error}
				</Alert>
			)}

			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={2}
				alignItems={{ xs: 'flex-start', md: 'center' }}
				justifyContent='space-between'
			>
				<Stack direction='row' spacing={1.5} alignItems='center'>
					<IconButton
						aria-label='Вернуться к списку'
						onClick={() => navigate('/list')}
					>
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

			<Paper
				sx={{
					p: 2,
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				{loading && (
					<LinearProgress
						sx={{
							position: 'absolute',
							left: 0,
							right: 0,
							top: 0,
						}}
					/>
				)}

				<Stack
					direction={{ xs: 'column', lg: 'row' }}
					spacing={2}
					sx={{ mt: loading ? 2 : 0 }}
				>
					<Box sx={{ flex: 1.4, minWidth: 0 }}>
						<Card
							variant='outlined'
							sx={{
								mb: 2,
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
							}}
						>
							<CardHeader
								avatar={<ImageIcon color='primary' />}
								title='Фотографии товара'
								subheader={
									images
										? `${images.length} фото в объявлении`
										: 'К объявлению не прикреплены изображения'
								}
							/>
							<CardContent>
								<Box
									sx={{
										borderRadius: 2,
										overflow: 'hidden',
										border: `1px solid ${theme.palette.divider}`,
										height: { xs: 220, md: 280 },
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										backgroundColor: theme.palette.grey[50],
									}}
								>
									{activeImage ? (
										<Box
											component='img'
											src={activeImage}
											alt={ad?.title ?? 'Фото объявления'}
											sx={{
												maxWidth: '100%',
												maxHeight: '100%',
												objectFit: 'contain',
											}}
										/>
									) : (
										<Stack
											alignItems='center'
											justifyContent='center'
											spacing={1}
										>
											<ImageIcon sx={{ fontSize: 40 }} color='disabled' />
											<Typography variant='body2' color='text.secondary'>
												Нет изображений
											</Typography>
										</Stack>
									)}
								</Box>

								{images && images.length > 1 && (
									<Stack
										direction='row'
										spacing={1}
										mt={1.5}
										sx={{ overflowX: 'auto' }}
									>
										{images.map((img, index) => (
											<Box
												key={img}
												component='img'
												src={img}
												alt={`${ad?.title ?? 'Фото'} #${index + 1}`}
												onClick={() => setActiveImageIndex(index)}
												sx={{
													width: 72,
													height: 72,
													objectFit: 'cover',
													borderRadius: 2,
													border:
														index === activeImageIndex
															? `2px solid ${theme.palette.primary.main}`
															: `1px solid ${theme.palette.divider}`,
													cursor: 'pointer',
													flexShrink: 0,
												}}
											/>
										))}
									</Stack>
								)}
							</CardContent>
						</Card>

						<Card variant='outlined'>
							<CardHeader
								title='Описание и характеристики'
								subheader='Проверьте корректность текста и атрибутов'
							/>
							<CardContent>
								<Typography
									variant='h6'
									gutterBottom
									sx={{ wordBreak: 'break-word' }}
								>
									{ad?.title ?? 'Заголовок объявления'}
								</Typography>

								<Typography variant='h5' color='primary' gutterBottom>
									{ad ? `${ad.price.toLocaleString('ru-RU')} ₽` : '—'}
								</Typography>

								<Typography variant='body2' color='text.secondary' gutterBottom>
									Категория: {ad?.category ?? '—'}
								</Typography>

								<Divider sx={{ my: 2 }} />

								<Typography variant='subtitle1' gutterBottom>
									Описание
								</Typography>
								<Typography variant='body1' sx={{ whiteSpace: 'pre-wrap' }}>
									{ad?.description ?? 'Описание отсутствует.'}
								</Typography>

								{ad?.attributes && ad.attributes.length > 0 && (
									<>
										<Divider sx={{ my: 2 }} />
										<Typography variant='subtitle1' gutterBottom>
											Характеристики
										</Typography>
										<Box
											component='dl'
											sx={{
												display: 'grid',
												gridTemplateColumns: {
													xs: '1fr',
													sm: '1.2fr 1.8fr',
												},
												gap: 1,
											}}
										>
											{ad.attributes.map(attr => (
												<React.Fragment key={attr.name}>
													<Typography
														component='dt'
														variant='body2'
														color='text.secondary'
													>
														{attr.name}
													</Typography>
													<Typography
														component='dd'
														variant='body2'
														sx={{ m: 0 }}
													>
														{attr.value}
													</Typography>
												</React.Fragment>
											))}
										</Box>
									</>
								)}
							</CardContent>
						</Card>
					</Box>

					<Box sx={{ flex: 1, minWidth: 280 }}>
						<Card variant='outlined' sx={{ mb: 2 }}>
							<CardHeader
								avatar={<PersonIcon color='primary' />}
								title='Информация о продавце'
								subheader='Используйте данные о продавце для оценки надёжности объявления'
							/>
							<CardContent>
								{ad?.seller ? (
									<>
										<Stack
											direction='row'
											spacing={2}
											alignItems='center'
											sx={{ mb: 2 }}
										>
											<Avatar>
												{ad.seller.name
													.split(' ')
													.map(part => part[0])
													.join('')
													.toUpperCase()}
											</Avatar>
											<Box>
												<Typography variant='subtitle1'>
													{ad.seller.name}
												</Typography>
												{ad.seller.city && (
													<Typography variant='body2' color='text.secondary'>
														{ad.seller.city}
													</Typography>
												)}
											</Box>
										</Stack>

										<Box
											component='dl'
											sx={{
												display: 'grid',
												gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
												rowGap: 1,
												columnGap: 2,
											}}
										>
											<Typography
												component='dt'
												variant='body2'
												color='text.secondary'
											>
												Имя
											</Typography>
											<Typography component='dd' variant='body2' sx={{ m: 0 }}>
												{ad.seller.name || '—'}
											</Typography>

											<Typography
												component='dt'
												variant='body2'
												color='text.secondary'
											>
												Рейтинг
											</Typography>
											<Typography component='dd' variant='body2' sx={{ m: 0 }}>
												{typeof ad.seller.rating === 'number'
													? ad.seller.rating.toFixed(1)
													: '—'}
											</Typography>

											<Typography
												component='dt'
												variant='body2'
												color='text.secondary'
											>
												Количество объявлений
											</Typography>
											<Typography component='dd' variant='body2' sx={{ m: 0 }}>
												{typeof ad.seller.totalAds === 'number'
													? ad.seller.totalAds
													: '—'}
											</Typography>

											<Typography
												component='dt'
												variant='body2'
												color='text.secondary'
											>
												Дата регистрации
											</Typography>
											<Typography component='dd' variant='body2' sx={{ m: 0 }}>
												{ad.seller.registeredAt
													? new Date(ad.seller.registeredAt).toLocaleDateString(
															'ru-RU'
													  )
													: '—'}
											</Typography>
										</Box>
									</>
								) : (
									<Typography variant='body2' color='text.secondary'>
										Данные о продавце отсутствуют.
									</Typography>
								)}
							</CardContent>
						</Card>

						{ad?.stats && (
							<Card variant='outlined' sx={{ mb: 2 }}>
								<CardHeader
									title='Статистика объявления'
									subheader='Помогает оценить эффективность и риски'
								/>
								<CardContent>
									<Stack direction='row' spacing={1.5} flexWrap='wrap'>
										<Chip
											icon={<VisibilityIcon />}
											label={`Просмотры: ${ad.stats.views}`}
											variant='outlined'
											size='small'
										/>
										<Chip
											icon={<FavoriteBorderIcon />}
											label={`В избранном: ${ad.stats.favorites}`}
											variant='outlined'
											size='small'
										/>
										<Chip
											icon={<ReportProblemIcon />}
											label={`Жалобы: ${ad.stats.complaints}`}
											color={ad.stats.complaints > 0 ? 'warning' : 'default'}
											variant='outlined'
											size='small'
										/>
									</Stack>
								</CardContent>
							</Card>
						)}

						<Card variant='outlined'>
							<CardHeader
								avatar={<HistoryIcon color='primary' />}
								title='История модерации'
								subheader={
									history.length
										? 'Все действия с объявлением'
										: historyLoading
										? 'Загружаем историю...'
										: 'История пока пустая'
								}
								action={
									<Tooltip title='Обновить историю'>
										<span>
											<IconButton
												size='small'
												onClick={() => void loadHistory()}
												disabled={historyLoading}
											>
												{historyLoading ? (
													<LinearProgress sx={{ width: 36, height: 2 }} />
												) : (
													<ArrowForwardIosIcon fontSize='small' />
												)}
											</IconButton>
										</span>
									</Tooltip>
								}
							/>
							<CardContent sx={{ pt: 0 }}>
								<List dense>
									{history.map(item => (
										<React.Fragment key={item.id}>
											<ListItem alignItems='flex-start'>
												<ListItemAvatar>
													<Avatar sx={{ width: 32, height: 32 }}>
														{item.moderatorName
															.split(' ')
															.map(part => part[0])
															.join('')
															.toUpperCase()}
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary={
														<Stack
															direction='row'
															spacing={1}
															alignItems='center'
														>
															<Typography variant='body2'>
																{item.moderatorName}
															</Typography>
															<Chip
																size='small'
																label={ACTION_LABELS[item.action]}
																color={
																	item.action === 'approved'
																		? 'success'
																		: item.action === 'rejected'
																		? 'error'
																		: 'default'
																}
															/>
														</Stack>
													}
													secondary={
														<>
															<Typography
																component='span'
																variant='caption'
																color='text.secondary'
																display='block'
															>
																{formatDateTime(item.timestamp)}
															</Typography>
															{item.reason && (
																<Typography
																	component='span'
																	variant='body2'
																	display='block'
																>
																	Причина: {item.reason}
																</Typography>
															)}
															{item.comment && (
																<Typography
																	component='span'
																	variant='body2'
																	display='block'
																>
																	Комментарий: {item.comment}
																</Typography>
															)}
														</>
													}
												/>
											</ListItem>
											<Divider variant='inset' component='li' />
										</React.Fragment>
									))}
									{!history.length && !historyLoading && (
										<Typography
											variant='body2'
											color='text.secondary'
											sx={{ p: 2 }}
										>
											Пока нет записей — это может быть новое объявление.
										</Typography>
									)}
								</List>
							</CardContent>
						</Card>
					</Box>
				</Stack>
			</Paper>
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
				<Typography variant='subtitle1'>
					Примите решение по объявлению
				</Typography>

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
						onClick={() => void handleApprove()}
					>
						Одобрить
					</Button>

					<Button
						variant='contained'
						color='error'
						startIcon={<CancelIcon />}
						disabled={!ad || actionLoading}
						onClick={handleOpenRejectDialog}
					>
						Отклонить
					</Button>

					<Button
						variant='outlined'
						color='warning'
						startIcon={<EditNoteIcon />}
						disabled={!ad || actionLoading}
						onClick={() => void handleRequestChanges()}
					>
						На доработку
					</Button>
				</Stack>
			</Paper>
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

			<Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog}>
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
									onChange={() => toggleRejectReason('banned')}
								/>
							}
							label={REJECT_REASON_LABELS.banned}
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={rejectReasons.includes('wrong_category')}
									onChange={() => toggleRejectReason('wrong_category')}
								/>
							}
							label={REJECT_REASON_LABELS.wrong_category}
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={rejectReasons.includes('incorrect_description')}
									onChange={() => toggleRejectReason('incorrect_description')}
								/>
							}
							label={REJECT_REASON_LABELS.incorrect_description}
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={rejectReasons.includes('photo_problems')}
									onChange={() => toggleRejectReason('photo_problems')}
								/>
							}
							label={REJECT_REASON_LABELS.photo_problems}
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={rejectReasons.includes('fraud_suspected')}
									onChange={() => toggleRejectReason('fraud_suspected')}
								/>
							}
							label={REJECT_REASON_LABELS.fraud_suspected}
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={rejectReasons.includes('other')}
									onChange={() => toggleRejectReason('other')}
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
						onChange={e => setRejectComment(e.target.value)}
						error={
							rejectTouched &&
							rejectReasons.length === 0 &&
							rejectComment.trim().length === 0
						}
						helperText={
							rejectTouched &&
							rejectReasons.length === 0 &&
							rejectComment.trim().length === 0
								? 'Укажите хотя бы одну причину или напишите комментарий'
								: 'Причина отклонения обязательна'
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseRejectDialog}>Отмена</Button>
					<Button
						onClick={() => void handleConfirmReject()}
						variant='contained'
						color='error'
						disabled={actionLoading}
					>
						Отклонить
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}
