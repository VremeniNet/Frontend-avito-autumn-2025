import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import type { PaletteMode } from '@mui/material'
import App from './App'
import { ColorModeContext, createAppTheme } from './theme.ts'

const Root: React.FC = () => {
	const [mode, setMode] = React.useState<PaletteMode>(() => {
		if (typeof window === 'undefined') return 'light'
		const stored = window.localStorage.getItem('moderation-theme')
		return stored === 'dark' || stored === 'light' ? stored : 'light'
	})

	const colorMode = React.useMemo(
		() => ({
			mode,
			toggleColorMode: () => {
				setMode(prev => {
					const next = prev === 'light' ? 'dark' : 'light'
					if (typeof window !== 'undefined') {
						window.localStorage.setItem('moderation-theme', next)
					}
					return next
				})
			},
		}),
		[mode]
	)

	const theme = React.useMemo(() => createAppTheme(mode), [mode])

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</ThemeProvider>
		</ColorModeContext.Provider>
	)
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Root />
	</React.StrictMode>
)

export default Root
