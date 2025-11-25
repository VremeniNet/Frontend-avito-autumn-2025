import React from 'react'
import { getAds } from '../../shared/api/adsApi.ts'
import {
	PAGE_LIMIT,
	type Advertisement,
	type PaginationInfo,
	type ModerationStatus,
} from '../../shared/types/ads.ts'

export type SortField = 'createdAt' | 'price' | 'priority'
export type SortOrder = 'asc' | 'desc'

export interface UseAdsListState {
	ads: Advertisement[]
	pagination: PaginationInfo | null
	loading: boolean
	error: string | null
	page: number
	statusFilter: ModerationStatus[]
	categoryId: number | 'all'
	minPrice: string
	maxPrice: string
	sortBy: SortField
	sortOrder: SortOrder
	searchInput: string
	search: string
	selectedIndex: number
}

export interface UseAdsListApi {
	setPage: (page: number) => void
	setStatusFilter: (statuses: ModerationStatus[]) => void
	setCategoryId: (id: number | 'all') => void
	setMinPrice: (v: string) => void
	setMaxPrice: (v: string) => void
	setSortBy: (field: SortField) => void
	setSortOrder: (order: SortOrder) => void
	setSearchInput: (v: string) => void
	applySearch: () => void
	resetFilters: () => void
	goToNext: () => void
	goToPrev: () => void
	openIndex: (idx: number) => void
}

export const useAdsList = (): [UseAdsListState, UseAdsListApi] => {
	const [ads, setAds] = React.useState<Advertisement[]>([])
	const [pagination, setPagination] = React.useState<PaginationInfo | null>(
		null
	)
	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState<string | null>(null)

	const [page, setPage] = React.useState(1)
	const [statusFilter, setStatusFilter] = React.useState<ModerationStatus[]>([
		'pending',
	])
	const [categoryId, setCategoryId] = React.useState<number | 'all'>('all')
	const [minPrice, setMinPrice] = React.useState('')
	const [maxPrice, setMaxPrice] = React.useState('')
	const [sortBy, setSortBy] = React.useState<SortField>('createdAt')
	const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc')
	const [searchInput, setSearchInput] = React.useState('')
	const [search, setSearch] = React.useState('')
	const [selectedIndex, setSelectedIndex] = React.useState(0)

	const fetchAds = React.useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const data = await getAds({
				page,
				limit: PAGE_LIMIT,
				status: statusFilter.length ? statusFilter : undefined,
				categoryId: categoryId === 'all' ? undefined : categoryId,
				minPrice: minPrice ? Number(minPrice) : undefined,
				maxPrice: maxPrice ? Number(maxPrice) : undefined,
				sortBy,
				sortOrder,
				search: search || undefined,
			})

			setAds(data.ads)
			setPagination(data.pagination)
			setSelectedIndex(0)
		} catch (e) {
			console.error(e)
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

	const applySearch = () => {
		setPage(1)
		setSearch(searchInput.trim())
	}

	const resetFilters = () => {
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

	const goToNext = () => {
		setSelectedIndex(prev => Math.min(prev + 1, Math.max(ads.length - 1, 0)))
	}

	const goToPrev = () => {
		setSelectedIndex(prev => Math.max(prev - 1, 0))
	}

	const openIndex = (idx: number) => {
		setSelectedIndex(Math.max(0, Math.min(idx, Math.max(ads.length - 1, 0))))
	}

	return [
		{
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
			search,
			selectedIndex,
		},
		{
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
		},
	]
}
