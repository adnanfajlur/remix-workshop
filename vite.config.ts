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
				unstable_singleFetch: true,
				unstable_optimizeDeps: true,
			},
			ignoredRouteFiles: ['**/**'], // ignore the default route files (we will define routes in defineRoutes() manually)
			routes(defineRoutes) {
				return defineRoutes((route) => {
					route('/auth', 'routes/auth/auth.route.tsx')
					route('/auth/github', 'routes/auth/github.route.tsx')
					route('/auth/google', 'routes/auth/google.route.tsx')
					route('/auth/log-out', 'routes/auth/log-out.route.tsx')

					route('/api/completion', 'routes/api/completion.ts')

					route('/server-error', 'routes/server-error/server-error.route.tsx')

					route('/c', 'routes/layout.route.tsx', () => {
						route(':id?', 'routes/conversation/conversation.route.tsx', { index: true })
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
