export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'draft'
export type Priority = 'normal' | 'urgent'

export interface Seller {
	id: number
	name: string
	rating?: number
	city?: string
}

export interface Advertisement {
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

export interface PaginationInfo {
	currentPage: number
	totalPages: number
	totalItems: number
	itemsPerPage: number
}

export const STATUS_LABELS: Record<ModerationStatus, string> = {
	pending: 'На проверке',
	approved: 'Одобрены',
	rejected: 'Отклонены',
	draft: 'Черновики',
}

export const PAGE_LIMIT = 10
