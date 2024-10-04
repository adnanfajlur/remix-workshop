import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

declare module '@remix-run/server-runtime' {
	// or cloudflare, deno, etc.
	interface Future {
		unstable_singleFetch: true
	}
}

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
			ignoredRouteFiles: ['**/**'], // ignore the default route files (we will define routes in below manually)
			routes(defineRoutes) {
				return defineRoutes((route) => {
					route('/auth', 'routes/auth/auth.route.tsx')
					route('/auth/github', 'routes/auth/github.route.tsx')
					route('/server-error', 'routes/server-error/server-error.route.tsx')
					route('/temp', 'routes/temp.route.tsx')
					route('/', 'routes/layout.route.tsx', () => {
						route('', 'routes/chat/chat.route.tsx', { index: true })
					})
				})
			},
		}),
		tsconfigPaths(),
	],
	server: {
		port: 3000,
	},
})
