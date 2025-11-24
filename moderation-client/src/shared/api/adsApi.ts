import axios from 'axios'
import type {
	Advertisement,
	PaginationInfo,
	ModerationStatus,
} from '../types/ads'

export interface AdsListParams {
	page: number
	limit: number
	status?: ModerationStatus[]
	categoryId?: number
	minPrice?: number
	maxPrice?: number
	sortBy?: 'createdAt' | 'price' | 'priority'
	sortOrder?: 'asc' | 'desc'
	search?: string
}

export interface AdsListResponse {
	ads: Advertisement[]
	pagination: PaginationInfo
}

export const getAds = async (
	params: AdsListParams
): Promise<AdsListResponse> => {
	const response = await axios.get('/api/v1/ads', {
		params,
		paramsSerializer: paramsObj => {
			const sp = new URLSearchParams()
			Object.entries(paramsObj).forEach(([key, value]) => {
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

	return response.data as AdsListResponse
}
