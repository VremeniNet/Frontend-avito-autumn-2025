import React from 'react'
import { useQuery } from '@tanstack/react-query'
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

	const {
		data,
		isLoading,
		isFetching,
		error: queryError,
	} = useQuery({
		queryKey: [
			'ads',
			{
				page,
				statusFilter,
				categoryId,
				minPrice,
				maxPrice,
				sortBy,
				sortOrder,
				search,
			},
		],
		queryFn: () =>
			getAds({
				page,
				limit: PAGE_LIMIT,
				status: statusFilter.length ? statusFilter : undefined,
				categoryId: categoryId === 'all' ? undefined : categoryId,
				minPrice: minPrice ? Number(minPrice) : undefined,
				maxPrice: maxPrice ? Number(maxPrice) : undefined,
				sortBy,
				sortOrder,
				search: search || undefined,
			}),
		staleTime: 30_000,
		refetchOnWindowFocus: false,
	})

	React.useEffect(() => {
		setSelectedIndex(0)
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

	const ads = data?.ads ?? []
	const pagination = data?.pagination ?? null
	const loading = isLoading || isFetching
	const error = queryError
		? 'Не удалось загрузить объявления. Попробуйте обновить позже.'
		: null

	const applySearch = () => {
		setPage(1)
		setSearch(searchInput.trim())
	}

	const resetFilters = () => {
		setPage(1)
		setStatusFilter(['pending'])
		setCategoryId('all')
		setMinPrice('')
		setMaxPrice('')
		setSortBy('createdAt')
		setSortOrder('desc')
		setSearchInput('')
		setSearch('')
		setSelectedIndex(0)
	}

	const goToNext = () => {
		setSelectedIndex(prev => {
			if (ads.length === 0) return 0
			return Math.min(prev + 1, ads.length - 1)
		})
	}

	const goToPrev = () => {
		setSelectedIndex(prev => {
			if (ads.length === 0) return 0
			return Math.max(prev - 1, 0)
		})
	}

	const openIndex = (idx: number) => {
		if (idx < 0 || idx >= ads.length) return
		setSelectedIndex(idx)
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
