import { createTheme, CSSVariablesResolver } from '@mantine/core'

export const theme = createTheme({
	cursorType: 'pointer',
	primaryColor: 'blue',
	defaultRadius: 'sm',
	fontFamily: '"Inter", sans-serif',
	headings: { fontFamily: '"Greycliff CF", sans-serif' },
})

export const themeVarResolver: CSSVariablesResolver = (theme) => {
	return {
		variables: {},
		light: {},
		dark: {
			// '--mantine-color-body': theme.colors.dark[8],
		},
	}
}
