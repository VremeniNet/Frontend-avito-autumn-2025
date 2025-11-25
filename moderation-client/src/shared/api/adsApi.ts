import axios from 'axios'
import type {
	Advertisement,
	AdvertisementDetails,
	PaginationInfo,
	ModerationStatus,
} from '../types/ads.ts'

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

// ------- детальная карточка --------

export const getAdDetails = async (
	id: number
): Promise<AdvertisementDetails> => {
	const response = await axios.get(`/api/v1/ads/${id}`)
	return response.data as AdvertisementDetails
}

export const approveAd = async (id: number): Promise<void> => {
	await axios.post(`/api/v1/ads/${id}/approve`)
}

export interface RejectAdPayload {
	reason: string
	comment?: string
}

export const rejectAd = async (
	id: number,
	payload: RejectAdPayload
): Promise<void> => {
	await axios.post(`/api/v1/ads/${id}/reject`, payload)
}

export interface RequestChangesPayload {
	comment: string
}

export const requestAdChanges = async (
	id: number,
	payload: RequestChangesPayload
): Promise<void> => {
	await axios.post(`/api/v1/ads/${id}/request-changes`, payload)
}
