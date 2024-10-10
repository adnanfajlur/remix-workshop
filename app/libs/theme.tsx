import { Button, createTheme, CSSVariablesResolver, DEFAULT_THEME, defaultVariantColorsResolver, isLightColor, parseThemeColor, rgba, Tooltip } from '@mantine/core'

export const theme = createTheme({
	cursorType: 'pointer',
	primaryColor: 'dark',
	primaryShade: { light: 6, dark: 8 },
	defaultRadius: 'md',
	autoContrast: true,
	fontFamily: '"Inter", sans-serif',
	headings: { fontFamily: '"Greycliff CF", sans-serif' },
	components: {
		Tooltip: Tooltip.extend({
			defaultProps: { withArrow: true, openDelay: 200 },
			classNames: { tooltip: 'text-[13px]' },
		}),
		Button: Button.extend({
			defaultProps: { fw: 400 },
		}),
	},
	// https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/core/src/core/MantineProvider/color-functions/default-variant-colors-resolver/default-variant-colors-resolver.ts
	variantColorResolver: (input) => {
		const defaultResolvedColors = defaultVariantColorsResolver(input)
		const parsed = parseThemeColor({
			color: input.color || input.theme.primaryColor,
			theme: input.theme,
		})

		if (input.variant === 'filled' && parsed.isThemeColor) {
			if (parsed.shade !== undefined) {
				return {
					...defaultResolvedColors,
					hover: `var(--mantine-color-${parsed.color}-${parsed.shade - 2})`,
				}
			}
		}

		return defaultResolvedColors
	},
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
