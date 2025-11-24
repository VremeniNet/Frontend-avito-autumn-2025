import React from 'react'
import { useParams } from 'react-router-dom'
import { Typography } from '@mui/material'

export const ItemPage: React.FC = () => {
	const { id } = useParams<{ id: string }>()

	return (
		<>
			<Typography variant='h4' gutterBottom>
				Объявление #{id}
			</Typography>
		</>
	)
}
