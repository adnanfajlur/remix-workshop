import { vitePlugin as remix } from '@remix-run/dev'
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
			routes(defineRoutes) {
				return defineRoutes((route) => {
					route('/auth', 'routes/auth/auth.route.tsx')
					route('/', 'routes/layout.route.tsx', () => {
						route('', 'routes/chat/chat.route.tsx', { index: true })
					})
				})
			},
		}),
		tsconfigPaths(),
	],
	server: { port: 3000 },
})
