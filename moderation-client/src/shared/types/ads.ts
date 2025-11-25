export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'draft'
export type Priority = 'normal' | 'urgent'

export interface Seller {
	id: number
	name: string
	rating?: number
	city?: string
	totalAds?: number
	registeredAt?: string
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
	updatedAt?: string
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

export interface AdAttribute {
	name: string
	value: string
}

export interface AdStats {
	views: number
	favorites: number
	complaints: number
}

export type ModerationAction =
	| 'created'
	| 'approved'
	| 'rejected'
	| 'requestChanges'

export interface ModerationHistoryItem {
	id: number
	adId: number
	action: ModerationAction
	moderatorName: string
	reason?: string | null
	comment?: string | null
	timestamp: string
}

export interface AdvertisementDetails extends Advertisement {
	attributes?: AdAttribute[]
	stats?: AdStats
	moderationHistory?: ModerationHistoryItem[]
}

export type RejectReasonCode =
	| 'banned'
	| 'wrong_category'
	| 'incorrect_description'
	| 'photo_problems'
	| 'fraud_suspected'
	| 'other'

export const PRIORITY_LABELS: Record<Priority, string> = {
	normal: 'Обычное',
	urgent: 'Срочное',
}

export const ACTION_LABELS: Record<ModerationAction, string> = {
	created: 'Создано',
	approved: 'Одобрено',
	rejected: 'Отклонено',
	requestChanges: 'Запрошены правки',
}

export const REJECT_REASON_LABELS: Record<RejectReasonCode, string> = {
	banned: 'Запрещённый товар',
	wrong_category: 'Неверная категория',
	incorrect_description: 'Некорректное описание',
	photo_problems: 'Проблемы с фото',
	fraud_suspected: 'Подозрение на мошенничество',
	other: 'Другое',
}

export const formatDateTime = (value?: string) => {
	if (!value) return '—'
	return new Date(value).toLocaleString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

export const statusChipColor = (
	s: ModerationStatus
): 'default' | 'success' | 'error' | 'warning' => {
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
