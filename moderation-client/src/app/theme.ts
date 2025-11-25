import * as React from 'react'
import { createTheme, type ThemeOptions } from '@mui/material/styles'
import type { PaletteMode } from '@mui/material'

export const ColorModeContext = React.createContext<{
	mode: PaletteMode
	toggleColorMode: () => void
}>({
	mode: 'light',
	toggleColorMode: () => {},
})

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
	palette: {
		mode,
		...(mode === 'light'
			? {
					primary: { main: '#1976d2' },
					secondary: { main: '#ff9800' },
					background: {
						default: '#f4f6fb',
						paper: '#ffffff',
					},
			  }
			: {
					primary: { main: '#90caf9' },
					secondary: { main: '#ffb74d' },
					background: {
						default: '#050814',
						paper: '#111727',
					},
			  }),
	},
	shape: {
		borderRadius: 12,
	},
	typography: {
		fontFamily:
			'"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		h4: {
			fontWeight: 600,
			letterSpacing: 0.2,
		},
	},
	components: {
		MuiPaper: {
			defaultProps: { elevation: 0 },
			styleOverrides: {
				root: {
					borderRadius: 16,
					borderWidth: 1,
					borderStyle: 'solid',
					borderColor:
						mode === 'light' ? 'rgba(15,23,42,0.04)' : 'rgba(148,163,184,0.25)',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 999,
					textTransform: 'none',
					fontWeight: 500,
				},
			},
		},
	},
})

export const createAppTheme = (mode: PaletteMode) =>
	createTheme(getDesignTokens(mode))
