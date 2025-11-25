import React from 'react'
import {
	Avatar,
	Box,
	Card,
	CardContent,
	CardHeader,
	Chip,
	Divider,
	IconButton,
	LinearProgress,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Paper,
	Stack,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import HistoryIcon from '@mui/icons-material/History'
import ImageIcon from '@mui/icons-material/Image'
import PersonIcon from '@mui/icons-material/Person'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import {
	ACTION_LABELS,
	formatDateTime,
	type AdvertisementDetails,
	type ModerationHistoryItem,
} from '../../../shared/types/ads.ts'

interface AdItemMainContentProps {
	ad: AdvertisementDetails | null
	history: ModerationHistoryItem[]
	historyLoading: boolean
	loading: boolean
	activeImageIndex: number
	onImageChange: (index: number) => void
	onReloadHistory: () => void
}

export const AdItemMainContent: React.FC<AdItemMainContentProps> = ({
	ad,
	history,
	historyLoading,
	loading,
	activeImageIndex,
	onImageChange,
	onReloadHistory,
}) => {
	const theme = useTheme()

	const images = ad?.images && ad.images.length > 0 ? ad.images : null
	const activeImage =
		images && images.length > 0
			? images[Math.min(activeImageIndex, images.length - 1)]
			: null

	return (
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
											onClick={() => onImageChange(index)}
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
											onClick={onReloadHistory}
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
	)
}
