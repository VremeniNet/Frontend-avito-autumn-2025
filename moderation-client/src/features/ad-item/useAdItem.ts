import React from 'react'
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

export interface UseAdItemResult {
	ad: AdvertisementDetails | null
	history: ModerationHistoryItem[]
	loading: boolean
	historyLoading: boolean
	error: string | null
	setError: (value: string | null) => void

	actionLoading: boolean

	activeImageIndex: number
	setActiveImageIndex: (index: number) => void

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
	const [ad, setAd] = React.useState<AdvertisementDetails | null>(null)
	const [history, setHistory] = React.useState<ModerationHistoryItem[]>([])
	const [loading, setLoading] = React.useState(false)
	const [historyLoading, setHistoryLoading] = React.useState(false)
	const [error, setError] = React.useState<string | null>(null)
	const [actionLoading, setActionLoading] = React.useState(false)

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

	const loadAd = React.useCallback(async () => {
		if (!adId || !Number.isFinite(adId)) {
			setError('Некорректный идентификатор объявления')
			return
		}

		setLoading(true)
		setError(null)

		try {
			const data = await getAdDetails(adId)
			setAd(data)
			setActiveImageIndex(0)

			const historyList = data.moderationHistory ?? []
			setHistory(sortHistory(historyList))
		} catch (err) {
			console.error(err)
			setError('Не удалось загрузить объявление. Попробуйте позже.')
		} finally {
			setLoading(false)
		}
	}, [adId, sortHistory])

	const reloadHistory = React.useCallback(async () => {
		if (!adId || !Number.isFinite(adId)) return

		setHistoryLoading(true)
		try {
			const data = await getAdDetails(adId)
			const historyList = data.moderationHistory ?? []
			setHistory(sortHistory(historyList))
		} catch (err) {
			console.error(err)
		} finally {
			setHistoryLoading(false)
		}
	}, [adId, sortHistory])

	React.useEffect(() => {
		if (!adId || !Number.isFinite(adId)) return
		void loadAd()
	}, [adId, loadAd])

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
		if (!ad || actionLoading) return
		setActionLoading(true)
		setError(null)

		try {
			await approveAd(ad.id)
			setAd(prev => (prev ? { ...prev, status: 'approved' } : prev))
			void reloadHistory()
		} catch (err) {
			console.error(err)
			setError('Не удалось одобрить объявление. Попробуйте ещё раз.')
		} finally {
			setActionLoading(false)
		}
	}, [ad, actionLoading, reloadHistory])

	const confirmReject = React.useCallback(async () => {
		if (!ad || actionLoading) return

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

		setActionLoading(true)
		setError(null)

		try {
			await rejectAd(ad.id, {
				reason: REJECT_REASON_LABELS[primaryReason],
				comment: commentToSend || undefined,
			})

			setAd(prev => (prev ? { ...prev, status: 'rejected' } : prev))
			setRejectDialogOpen(false)
			setRejectComment('')
			setRejectReasons([])
			setRejectTouched(false)
			void reloadHistory()
		} catch (err) {
			console.error(err)
			setError('Не удалось отклонить объявление. Попробуйте ещё раз.')
		} finally {
			setActionLoading(false)
		}
	}, [ad, actionLoading, rejectComment, rejectReasons, reloadHistory])

	const requestChanges = React.useCallback(async () => {
		if (!ad || actionLoading) return

		const comment =
			rejectComment ||
			'Пожалуйста, уточните описание и корректно заполните характеристики.'

		setActionLoading(true)
		setError(null)

		try {
			await requestAdChanges(ad.id, { comment })

			setAd(prev => (prev ? { ...prev, status: 'pending' } : prev))
			setRejectComment('')
			void reloadHistory()
		} catch (err) {
			console.error(err)
			setError('Не удалось отправить объявление на доработку.')
		} finally {
			setActionLoading(false)
		}
	}, [ad, actionLoading, rejectComment, reloadHistory])

	return {
		ad,
		history,
		loading,
		historyLoading,
		error,
		setError,
		actionLoading,
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
