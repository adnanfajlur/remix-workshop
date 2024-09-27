import { defineConfig, presetUno, transformerVariantGroup } from 'unocss'

export default defineConfig({
	presets: [
		presetUno(),
	],
	transformers: [
		transformerVariantGroup(),
	],
	theme: {
		breakpoints: {
			xs: '36em',
			sm: '48em',
			md: '62em',
			lg: '75em',
			xl: '88em',
		},
	},
})
