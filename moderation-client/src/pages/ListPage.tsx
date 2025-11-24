import React from 'react'
import axios from 'axios'
import {
	Alert,
	Avatar,
	Box,
	Button,
	Card,
	Chip,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	LinearProgress,
	MenuItem,
	Pagination,
	Paper,
	Select,
	Stack,
	TextField,
	Tooltip,
	Typography,
	useTheme,
	Grow,
	Checkbox,
	ListItemText,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import SearchIcon from '@mui/icons-material/Search'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import RefreshIcon from '@mui/icons-material/Refresh'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import BoltIcon from '@mui/icons-material/Bolt'

type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'draft'
type Priority = 'normal' | 'urgent'

interface Seller {
	id: number
	name: string
	rating?: number
	city?: string
}

interface Advertisement {
	id: number
	title: string
	description: string
	price: number
	category: string
	categoryId?: number
	status: ModerationStatus
	priority: Priority
	createdAt: string
	images?: string[]
	seller?: Seller
}

interface PaginationInfo {
	page: number
	limit: number
	total: number
	totalPages: number
}

const PAGE_LIMIT = 10

const STATUS_LABELS: Record<ModerationStatus, string> = {
	pending: 'На проверке',
	approved: 'Одобрены',
	rejected: 'Отклонены',
	draft: 'Черновики',
}

export const ListPage: React.FC = () => {
	const theme = useTheme()
	const navigate = useNavigate()

	const [ads, setAds] = React.useState<Advertisement[]>([])
	const [pagination, setPagination] = React.useState<PaginationInfo | null>(
		null
	)
	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState<string | null>(null)

	const [page, setPage] = React.useState(1)

	// фильтр по статусу
	const [statusFilter, setStatusFilter] = React.useState<ModerationStatus[]>([
		'pending',
	])

	// фильтр по категории
	const [categoryId, setCategoryId] = React.useState<number | 'all'>('all')
	const [availableCategories, setAvailableCategories] = React.useState<
		{ id: number; name: string }[]
	>([])

	// фильтр по диапазону цен
	const [minPrice, setMinPrice] = React.useState<string>('')
	const [maxPrice, setMaxPrice] = React.useState<string>('')

	// сортировка
	const [sortBy, setSortBy] = React.useState<
		'createdAt' | 'price' | 'priority'
	>('createdAt')
	const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')

	// поиск
	const [searchInput, setSearchInput] = React.useState('')
	const [search, setSearch] = React.useState('')
	const searchRef = React.useRef<HTMLInputElement | null>(null)

	const [selectedIndex, setSelectedIndex] = React.useState(0)
	const [animateList, setAnimateList] = React.useState(false)

	React.useEffect(() => {
		setAnimateList(true)
	}, [])

	const fetchAds = React.useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const response = await axios.get('/api/v1/ads', {
				params: {
					page,
					limit: PAGE_LIMIT,
					status: statusFilter.length ? statusFilter : undefined,
					categoryId: categoryId === 'all' ? undefined : categoryId,
					minPrice: minPrice ? Number(minPrice) : undefined,
					maxPrice: maxPrice ? Number(maxPrice) : undefined,
					sortBy,
					sortOrder,
					search: search || undefined,
				},
				paramsSerializer: params => {
					const sp = new URLSearchParams()

					Object.entries(params).forEach(([key, value]) => {
						if (value === undefined || value === null || value === '') return

						if (Array.isArray(value)) {
							value.forEach(v => sp.append(key, String(v)))
						} else {
							sp.append(key, String(value))
						}
					})

					return sp.toString()
				},
			})

			const data = response.data as {
				ads: Advertisement[]
				pagination: PaginationInfo
			}

			setAds(data.ads)
			setPagination(data.pagination)
			setSelectedIndex(0)

			setAvailableCategories(prev => {
				const map = new Map<number, string>()
				prev.forEach(c => map.set(c.id, c.name))
				data.ads.forEach(ad => {
					if (ad.categoryId != null && !map.has(ad.categoryId)) {
						map.set(ad.categoryId, ad.category)
					}
				})
				return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) =>
					a.name.localeCompare(b.name)
				)
			})
		} catch (err) {
			console.error(err)
			setError('Не удалось загрузить объявления. Попробуйте обновить позже.')
		} finally {
			setLoading(false)
		}
	}, [
		page,
		statusFilter,
		categoryId,
		minPrice,
		maxPrice,
		sortBy,
		sortOrder,
		search,
	])

	React.useEffect(() => {
		fetchAds()
	}, [fetchAds])

	const handleSearchApply = () => {
		setPage(1)
		setSearch(searchInput.trim())
	}

	const handleStatusChange = (
		event: SelectChangeEvent<typeof statusFilter>
	) => {
		const value = event.target.value
		const next =
			typeof value === 'string'
				? (value.split(',').filter(Boolean) as ModerationStatus[])
				: (value as ModerationStatus[])

		setStatusFilter(next)
		setPage(1)
	}

	const handleCategoryChange = (event: SelectChangeEvent<string>) => {
		const value = event.target.value
		if (value === 'all') {
			setCategoryId('all')
		} else {
			setCategoryId(Number(value))
		}
		setPage(1)
	}

	const handleSortByChange = (event: SelectChangeEvent) => {
		const value = event.target.value as 'createdAt' | 'price' | 'priority'
		setSortBy(value)
	}

	const handleResetFilters = () => {
		setStatusFilter(['pending'])
		setCategoryId('all')
		setMinPrice('')
		setMaxPrice('')
		setSortBy('createdAt')
		setSortOrder('desc')
		setSearch('')
		setSearchInput('')
		setPage(1)
	}

	const goToNext = React.useCallback(() => {
		setSelectedIndex(prev => Math.min(prev + 1, Math.max(ads.length - 1, 0)))
	}, [ads.length])

	const goToPrev = React.useCallback(() => {
		setSelectedIndex(prev => Math.max(prev - 1, 0))
	}, [])

	const openCurrentAd = React.useCallback(
		(idx: number) => {
			const ad = ads[idx]
			if (!ad) return
			navigate(`/item/${ad.id}`)
		},
		[ads, navigate]
	)

	React.useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null
			const tag = target?.tagName
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
				return
			}

			if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
				event.preventDefault()
				searchRef.current?.focus()
				return
			}

			switch (event.key) {
				case 'ArrowDown':
					event.preventDefault()
					goToNext()
					break
				case 'ArrowUp':
					event.preventDefault()
					goToPrev()
					break
				case 'Enter':
					event.preventDefault()
					openCurrentAd(selectedIndex)
					break
				default:
					break
			}
		}

		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [goToNext, goToPrev, openCurrentAd, selectedIndex])

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
				<Box>
					<Typography variant='h4' gutterBottom>
						Список объявлений
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						Фильтруйте, сортируйте и открывайте объявления для детальной
						проверки.
					</Typography>
				</Box>

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
			</Stack>

			<Paper
				sx={{
					p: 2,
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					gap: 2,
					alignItems: { xs: 'stretch', md: 'center' },
				}}
			>
				<TextField
					fullWidth
					size='small'
					label='Поиск по названию объявления'
					placeholder='Например, «iPhone 13», «велосипед».'
					value={searchInput}
					inputRef={searchRef}
					onChange={e => setSearchInput(e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							handleSearchApply()
						}
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<SearchIcon fontSize='small' />
							</InputAdornment>
						),
						endAdornment: (
							<InputAdornment position='end'>
								<Tooltip title='Применить поиск'>
									<IconButton size='small' onClick={handleSearchApply}>
										<FilterAltIcon fontSize='small' />
									</IconButton>
								</Tooltip>
							</InputAdornment>
						),
					}}
				/>

				<Stack
					direction='row'
					spacing={2}
					flexWrap='wrap'
					justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
					sx={{ mt: { xs: 1.5, md: 0 }, rowGap: 2 }}
				>
					<FormControl size='small' sx={{ minWidth: 190 }}>
						<InputLabel id='status-label'>Статус</InputLabel>
						<Select
							labelId='status-label'
							label='Статус'
							multiple
							value={statusFilter}
							onChange={handleStatusChange}
							renderValue={selected =>
								(selected as ModerationStatus[])
									.map(s => STATUS_LABELS[s])
									.join(', ')
							}
						>
							{(Object.keys(STATUS_LABELS) as ModerationStatus[]).map(
								status => (
									<MenuItem key={status} value={status}>
										<Checkbox checked={statusFilter.indexOf(status) > -1} />
										<ListItemText primary={STATUS_LABELS[status]} />
									</MenuItem>
								)
							)}
						</Select>
					</FormControl>

					<FormControl size='small' sx={{ minWidth: 180 }}>
						<InputLabel id='category-label'>Категория</InputLabel>
						<Select<string>
							labelId='category-label'
							label='Категория'
							value={categoryId === 'all' ? 'all' : String(categoryId)}
							onChange={handleCategoryChange}
						>
							<MenuItem value='all'>Все категории</MenuItem>
							{availableCategories.map(category => (
								<MenuItem key={category.id} value={String(category.id)}>
									{category.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Stack direction='row' spacing={1} alignItems='center'>
						<TextField
							size='small'
							type='number'
							label='Цена от'
							value={minPrice}
							onChange={e => {
								setMinPrice(e.target.value)
								setPage(1)
							}}
							sx={{ width: 110 }}
							InputProps={{ inputProps: { min: 0 } }}
						/>
						<TextField
							size='small'
							type='number'
							label='до'
							value={maxPrice}
							onChange={e => {
								setMaxPrice(e.target.value)
								setPage(1)
							}}
							sx={{ width: 110 }}
							InputProps={{ inputProps: { min: 0 } }}
						/>
					</Stack>

					<FormControl size='small' sx={{ minWidth: 140 }}>
						<InputLabel id='sort-label'>Сортировка</InputLabel>
						<Select
							labelId='sort-label'
							label='Сортировка'
							value={sortBy}
							onChange={handleSortByChange}
						>
							<MenuItem value='createdAt'>По дате</MenuItem>
							<MenuItem value='price'>По цене</MenuItem>
							<MenuItem value='priority'>По приоритету</MenuItem>
						</Select>
					</FormControl>

					<IconButton
						size='small'
						onClick={() =>
							setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
						}
						sx={{
							borderRadius: 999,
							border: `1px solid ${theme.palette.divider}`,
						}}
					>
						{sortOrder === 'asc' ? '↑' : '↓'}
					</IconButton>

					<Button
						size='small'
						variant='outlined'
						startIcon={<RefreshIcon />}
						onClick={handleResetFilters}
					>
						Сбросить
					</Button>
				</Stack>
			</Paper>

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
					spacing={1}
					mb={2}
					direction='row'
					justifyContent='space-between'
				>
					<Typography variant='subtitle2' color='text.secondary'>
						{pagination
							? `Страница ${pagination.page} из ${pagination.totalPages}, всего ${pagination.total} объявлений`
							: 'Очередь объявлений'}
					</Typography>

					<Stack direction='row' spacing={1}>
						<IconButton
							size='small'
							onClick={goToPrev}
							disabled={selectedIndex === 0 || ads.length === 0}
						>
							<ArrowBackIosNewIcon fontSize='inherit' />
						</IconButton>
						<IconButton
							size='small'
							onClick={goToNext}
							disabled={selectedIndex >= ads.length - 1 || ads.length === 0}
						>
							<ArrowForwardIosIcon fontSize='inherit' />
						</IconButton>
					</Stack>
				</Stack>

				<Stack spacing={1.5}>
					{ads.map((ad, index) => (
						<Grow
							in={animateList}
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
								onClick={() => openCurrentAd(index)}
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
											<Typography
												variant='subtitle1'
												fontWeight={600}
											>{`${ad.price.toLocaleString('ru-RU')} ₽`}</Typography>
											<Typography
												variant='body2'
												color='text.secondary'
											>{`· ${ad.category}`}</Typography>
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
										sx={{
											display: 'flex',
											alignItems: 'center',
										}}
										onClick={e => e.stopPropagation()}
									>
										<Button
											variant='contained'
											size='small'
											endIcon={<ArrowForwardIosIcon fontSize='inherit' />}
											onClick={() => openCurrentAd(index)}
										>
											Открыть
										</Button>
									</Box>
								</Box>
							</Card>
						</Grow>
					))}

					{!loading && ads.length === 0 && (
						<Typography variant='body2' color='text.secondary'>
							Нет объявлений по текущим фильтрам.
						</Typography>
					)}
				</Stack>

				{pagination && pagination.totalPages > 1 && (
					<Box mt={2} display='flex' justifyContent='center'>
						<Pagination
							color='primary'
							page={pagination.page}
							count={pagination.totalPages}
							onChange={(_, value) => {
								setPage(value)
								setSelectedIndex(0)
							}}
							size='small'
						/>
					</Box>
				)}
			</Paper>
		</Box>
	)
}
