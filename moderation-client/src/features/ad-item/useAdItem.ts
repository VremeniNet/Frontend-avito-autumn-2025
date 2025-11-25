import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type {
	AdvertisementDetails,
	ModerationHistoryItem,
	RejectReasonCode,
} from '../../shared/types/ads'
import { REJECT_REASON_LABELS } from '../../shared/types/ads.ts'
import {
	approveAd,
	getAdDetails,
	rejectAd,
	requestAdChanges,
} from '../../shared/api/adsApi'
import type { RejectAdPayload } from '../../shared/api/adsApi'

export interface UseAdItemResult {
	ad: AdvertisementDetails | null
	history: ModerationHistoryItem[]
	loading: boolean
	historyLoading: boolean
	actionLoading: boolean
	error: string | null
	setError: (value: string | null) => void

	activeImageIndex: number
	setActiveImageIndex: (idx: number) => void

	rejectDialogOpen: boolean
	rejectReasons: RejectReasonCode[]
	rejectComment: string
	rejectTouched: boolean
	setRejectComment: (value: string) => void

	toggleRejectReason: (code: RejectReasonCode) => void
	openRejectDialog: () => void
	closeRejectDialog: () => void
	confirmReject: () => Promise<void>
	approve: () => Promise<void>
	requestChanges: () => Promise<void>
	reloadHistory: () => Promise<void>
}

export const useAdItem = (adId: number | null): UseAdItemResult => {
	const queryClient = useQueryClient()

	const [error, setError] = React.useState<string | null>(null)
	const [actionLoading, setActionLoading] = React.useState(false)
	const [historyLoading, setHistoryLoading] = React.useState(false)

	const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false)
	const [rejectReasons, setRejectReasons] = React.useState<RejectReasonCode[]>(
		[]
	)
	const [rejectComment, setRejectComment] = React.useState('')
	const [rejectTouched, setRejectTouched] = React.useState(false)

	const [activeImageIndex, setActiveImageIndex] = React.useState(0)

	const sortHistory = React.useCallback(
		(items: ModerationHistoryItem[]): ModerationHistoryItem[] =>
			[...items].sort(
				(a, b) =>
					new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
			),
		[]
	)

	const isValidId = adId != null && Number.isFinite(adId)

	const {
		data,
		isLoading,
		error: loadError,
		refetch,
	} = useQuery<AdvertisementDetails, Error>({
		queryKey: ['ad', adId],
		enabled: isValidId,
		queryFn: () => getAdDetails(adId as number),
		staleTime: 30_000,
		refetchOnWindowFocus: false,
	})

	React.useEffect(() => {
		if (!isValidId) {
			setError('Некорректный идентификатор объявления')
			return
		}
		if (loadError) {
			console.error(loadError)
			setError('Не удалось загрузить объявление. Попробуйте позже.')
		}
	}, [isValidId, loadError])

	React.useEffect(() => {
		setActiveImageIndex(0)
	}, [adId])

	const ad = data ?? null
	const history = data?.moderationHistory
		? sortHistory(data.moderationHistory)
		: []

	const reloadHistory = React.useCallback(async () => {
		if (!isValidId) return
		setHistoryLoading(true)
		try {
			await refetch()
		} catch (e) {
			console.error(e)
		} finally {
			setHistoryLoading(false)
		}
	}, [isValidId, refetch])

	const toggleRejectReason = (code: RejectReasonCode) => {
		setRejectReasons(prev =>
			prev.includes(code) ? prev.filter(r => r !== code) : [...prev, code]
		)
	}

	const openRejectDialog = () => {
		setRejectDialogOpen(true)
	}

	const closeRejectDialog = () => {
		setRejectDialogOpen(false)
		setRejectTouched(false)
	}

	const approve = React.useCallback(async () => {
		if (!ad || actionLoading || !isValidId) return
		setActionLoading(true)
		setError(null)

		try {
			await approveAd(ad.id)

			queryClient.setQueryData<AdvertisementDetails | undefined>(
				['ad', adId],
				prev => (prev ? { ...prev, status: 'approved' } : prev)
			)

			void reloadHistory()
		} catch (err) {
			console.error(err)
			setError('Не удалось одобрить объявление. Попробуйте ещё раз.')
		} finally {
			setActionLoading(false)
		}
	}, [ad, actionLoading, isValidId, queryClient, adId, reloadHistory])

	const confirmReject = React.useCallback(async () => {
		if (!ad || actionLoading || !isValidId) return

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

		const payload: RejectAdPayload = {
			reason: REJECT_REASON_LABELS[primaryReason],
			comment: commentToSend || undefined,
		}

		setActionLoading(true)
		setError(null)

		try {
			await rejectAd(ad.id, payload)

			queryClient.setQueryData<AdvertisementDetails | undefined>(
				['ad', adId],
				prev => (prev ? { ...prev, status: 'rejected' } : prev)
			)

			setRejectComment('')
			setRejectReasons([])
			setRejectTouched(false)
			setRejectDialogOpen(false)

			void reloadHistory()
		} catch (err) {
			console.error(err)
			setError('Не удалось отклонить объявление. Попробуйте ещё раз.')
		} finally {
			setActionLoading(false)
		}
	}, [
		ad,
		actionLoading,
		isValidId,
		rejectComment,
		rejectReasons,
		queryClient,
		adId,
		reloadHistory,
	])

	const requestChanges = React.useCallback(async () => {
		if (!ad || actionLoading || !isValidId) return

		const comment =
			rejectComment ||
			'Пожалуйста, уточните описание и корректно заполните характеристики.'

		setActionLoading(true)
		setError(null)

		try {
			await requestAdChanges(ad.id, { comment })

			queryClient.setQueryData<AdvertisementDetails | undefined>(
				['ad', adId],
				prev => (prev ? { ...prev, status: 'pending' } : prev)
			)

			setRejectComment('')
			void reloadHistory()
		} catch (err) {
			console.error(err)
			setError('Не удалось отправить объявление на доработку.')
		} finally {
			setActionLoading(false)
		}
	}, [
		ad,
		actionLoading,
		isValidId,
		rejectComment,
		queryClient,
		adId,
		reloadHistory,
	])

	return {
		ad,
		history,
		loading: isLoading,
		historyLoading,
		actionLoading,
		error,
		setError,
		activeImageIndex,
		setActiveImageIndex,
		rejectDialogOpen,
		rejectReasons,
		rejectComment,
		rejectTouched,
		setRejectComment,
		toggleRejectReason,
		openRejectDialog,
		closeRejectDialog,
		confirmReject,
		approve,
		requestChanges,
		reloadHistory,
	}
}
