import { vitePlugin as remix } from '@remix-run/dev'
import unoCss from 'unocss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				unstable_optimizeDeps: true,
				unstable_singleFetch: true,
			},
		}),
		unoCss(),
		tsconfigPaths(),
	],
	server: { port: 3000 },
})
