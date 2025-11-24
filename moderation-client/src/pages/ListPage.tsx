import React from 'react'
import {
	Alert,
	Box,
	IconButton,
	LinearProgress,
	Pagination,
	Paper,
	Stack,
	Typography,
} from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router-dom'

import { useAdsList } from '../features/ads-list/useAdsList'
import { ListFilters } from '../features/ads-list/components/ListFilters'
import { AdsList } from '../features/ads-list/components/AdsList'
import { ListHotkeysHint } from '../features/ads-list/components/ListHotkeysHint'
import type { Advertisement } from '../shared/types/ads'

export const ListPage: React.FC = () => {
	const [state, api] = useAdsList()
	const navigate = useNavigate()
	const searchRef = React.useRef<HTMLInputElement>(null!)

	const {
		ads,
		pagination,
		loading,
		error,
		page,
		statusFilter,
		categoryId,
		minPrice,
		maxPrice,
		sortBy,
		sortOrder,
		searchInput,
		selectedIndex,
	} = state

	const {
		setPage,
		setStatusFilter,
		setCategoryId,
		setMinPrice,
		setMaxPrice,
		setSortBy,
		setSortOrder,
		setSearchInput,
		applySearch,
		resetFilters,
		goToNext,
		goToPrev,
		openIndex,
	} = api

	// Список категорий
	const availableCategories = React.useMemo(() => {
		const map = new Map<number, string>()
		ads.forEach((ad: Advertisement) => {
			if (ad.categoryId != null) {
				map.set(ad.categoryId, ad.category)
			}
		})
		return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) =>
			a.name.localeCompare(b.name)
		)
	}, [ads])

	// Открыть объявление
	const handleOpenAd = React.useCallback(
		(index: number) => {
			const ad = ads[index]
			if (!ad) return
			navigate(`/item/${ad.id}`)
		},
		[ads, navigate]
	)

	// Горячие клавиши
	React.useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null
			const tag = target?.tagName
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

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
					handleOpenAd(selectedIndex)
					break
				default:
					break
			}
		}

		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [goToNext, goToPrev, handleOpenAd, selectedIndex])

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
			{error && (
				<Alert severity='error' onClose={resetFilters}>
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

				<ListHotkeysHint />
			</Stack>

			<ListFilters
				searchInput={searchInput}
				onSearchInputChange={setSearchInput}
				onSearchApply={applySearch}
				searchInputRef={searchRef}
				statusFilter={statusFilter}
				onStatusFilterChange={setStatusFilter}
				categoryId={categoryId}
				availableCategories={availableCategories}
				onCategoryChange={setCategoryId}
				minPrice={minPrice}
				maxPrice={maxPrice}
				onMinPriceChange={value => {
					setMinPrice(value)
					setPage(1)
				}}
				onMaxPriceChange={value => {
					setMaxPrice(value)
					setPage(1)
				}}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSortByChange={setSortBy}
				onSortOrderToggle={() =>
					setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
				}
				onReset={resetFilters}
			/>

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
					alignItems='center'
				>
					<Typography variant='subtitle2' color='text.secondary'>
						{pagination
							? `Страница ${pagination.currentPage} из ${pagination.totalPages}, всего ${pagination.totalItems} объявлений`
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

				<AdsList
					ads={ads}
					selectedIndex={selectedIndex}
					onSelect={openIndex}
					onOpen={handleOpenAd}
				/>

				{pagination && pagination.totalPages > 1 && (
					<Box mt={2} display='flex' justifyContent='center'>
						<Pagination
							color='primary'
							page={page}
							count={pagination.totalPages}
							onChange={(_, value) => {
								setPage(value)
								openIndex(0)
							}}
							size='small'
						/>
					</Box>
				)}
			</Paper>
		</Box>
	)
}
