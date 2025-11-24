import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ListPage } from './pages/ListPage.tsx'
import { ItemPage } from './pages/ItemPage.tsx'
import { StatsPage } from './pages/StatsPage.tsx'

const App: React.FC = () => {
	return (
		<AppLayout>
			<Routes>
				<Route path='/' element={<Navigate to='/list' replace />} />
				<Route path='/list' element={<ListPage />} />
				<Route path='/item/:id' element={<ItemPage />} />
				<Route path='/stats' element={<StatsPage />} />
				<Route path='*' element={<Navigate to='/list' replace />} />
			</Routes>
		</AppLayout>
	)
}

export default App
