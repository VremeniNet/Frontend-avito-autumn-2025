import React from 'react'
import {
	Paper,
	TextField,
	InputAdornment,
	IconButton,
	Tooltip,
	Stack,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Checkbox,
	ListItemText,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import RefreshIcon from '@mui/icons-material/Refresh'

import { STATUS_LABELS, type ModerationStatus } from '../../../shared/types/ads'
import type { SortField, SortOrder } from '../useAdsList'

interface CategoryOption {
	id: number
	name: string
}

interface ListFiltersProps {
	// поиск
	searchInput: string
	onSearchInputChange: (value: string) => void
	onSearchApply: () => void
	searchInputRef?: React.RefObject<HTMLInputElement>

	// статус (множественный выбор)
	statusFilter: ModerationStatus[]
	onStatusFilterChange: (statuses: ModerationStatus[]) => void

	// категория
	categoryId: number | 'all'
	availableCategories: CategoryOption[]
	onCategoryChange: (category: number | 'all') => void

	// диапазон цен
	minPrice: string
	maxPrice: string
	onMinPriceChange: (value: string) => void
	onMaxPriceChange: (value: string) => void

	// сортировка
	sortBy: SortField
	sortOrder: SortOrder
	onSortByChange: (field: SortField) => void
	onSortOrderToggle: () => void

	// сброс
	onReset: () => void
}

export const ListFilters: React.FC<ListFiltersProps> = props => {
	const {
		searchInput,
		onSearchInputChange,
		onSearchApply,
		searchInputRef,

		statusFilter,
		onStatusFilterChange,

		categoryId,
		availableCategories,
		onCategoryChange,

		minPrice,
		maxPrice,
		onMinPriceChange,
		onMaxPriceChange,

		sortBy,
		sortOrder,
		onSortByChange,
		onSortOrderToggle,

		onReset,
	} = props

	// множественный выбор статусов
	const handleStatusChange = (
		event: SelectChangeEvent<typeof statusFilter>
	) => {
		const { value } = event.target
		const next =
			typeof value === 'string'
				? (value.split(',').filter(Boolean) as ModerationStatus[])
				: (value as ModerationStatus[])

		onStatusFilterChange(next)
	}

	// смена категории
	const handleCategoryChange = (event: SelectChangeEvent<string>) => {
		const value = event.target.value
		if (value === 'all') {
			onCategoryChange('all')
		} else {
			onCategoryChange(Number(value))
		}
	}

	const handleSearchKeyDown: React.KeyboardEventHandler<
		HTMLInputElement
	> = e => {
		if (e.key === 'Enter') {
			onSearchApply()
		}
	}

	return (
		<Paper
			sx={{
				p: 2,
				display: 'flex',
				flexDirection: { xs: 'column', md: 'row' },
				gap: 2,
				alignItems: { xs: 'stretch', md: 'center' },
			}}
		>
			{/* Поиск по названию */}
			<TextField
				fullWidth
				size='small'
				label='Поиск по названию объявления'
				placeholder='Например, «iPhone 13», «велосипед».'
				value={searchInput}
				inputRef={searchInputRef}
				onChange={e => onSearchInputChange(e.target.value)}
				onKeyDown={handleSearchKeyDown}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<SearchIcon fontSize='small' />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position='end'>
							<Tooltip title='Применить поиск'>
								<IconButton size='small' onClick={onSearchApply}>
									<FilterAltIcon fontSize='small' />
								</IconButton>
							</Tooltip>
						</InputAdornment>
					),
				}}
			/>

			{/* Остальные фильтры */}
			<Stack
				direction='row'
				spacing={2}
				flexWrap='wrap'
				justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
				sx={{ mt: { xs: 1.5, md: 0 }, rowGap: 2 }}
			>
				{/* Статус (множественный выбор) */}
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
						{(Object.keys(STATUS_LABELS) as ModerationStatus[]).map(status => (
							<MenuItem key={status} value={status}>
								<Checkbox checked={statusFilter.indexOf(status) > -1} />
								<ListItemText primary={STATUS_LABELS[status]} />
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Категория */}
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

				{/* Диапазон цен */}
				<Stack direction='row' spacing={1} alignItems='center'>
					<TextField
						size='small'
						type='number'
						label='Цена от'
						value={minPrice}
						onChange={e => onMinPriceChange(e.target.value)}
						sx={{ width: 110 }}
						InputProps={{ inputProps: { min: 0 } }}
					/>
					<TextField
						size='small'
						type='number'
						label='до'
						value={maxPrice}
						onChange={e => onMaxPriceChange(e.target.value)}
						sx={{ width: 110 }}
						InputProps={{ inputProps: { min: 0 } }}
					/>
				</Stack>

				{/* Сортировка */}
				<FormControl size='small' sx={{ minWidth: 140 }}>
					<InputLabel id='sort-label'>Сортировка</InputLabel>
					<Select
						labelId='sort-label'
						label='Сортировка'
						value={sortBy}
						onChange={e => onSortByChange(e.target.value as SortField)}
					>
						<MenuItem value='createdAt'>По дате</MenuItem>
						<MenuItem value='price'>По цене</MenuItem>
						<MenuItem value='priority'>По приоритету</MenuItem>
					</Select>
				</FormControl>

				{/* Направление сортировки */}
				<IconButton
					size='small'
					onClick={onSortOrderToggle}
					sx={theme => ({
						borderRadius: 999,
						border: `1px solid ${theme.palette.divider}`,
						width: 32,
						height: 32,
					})}
				>
					{sortOrder === 'asc' ? '↑' : '↓'}
				</IconButton>

				{/* Сброс */}
				<Button
					size='small'
					variant='outlined'
					startIcon={<RefreshIcon />}
					onClick={onReset}
				>
					Сбросить
				</Button>
			</Stack>
		</Paper>
	)
}
