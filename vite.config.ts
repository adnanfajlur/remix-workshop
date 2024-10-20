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
				// unstable_singleFetch: true,
				unstable_optimizeDeps: true,
			},
			ignoredRouteFiles: ['**/**'], // ignore the default route files (we will define routes in defineRoutes() manually)
			routes(defineRoutes) {
				return defineRoutes((route) => {
					route('/auth', 'routes/auth/auth.route.tsx')
					route('/auth/github', 'routes/auth/github.route.tsx')
					route('/auth/google', 'routes/auth/google.route.tsx')
					route('/auth/log-out', 'routes/auth/log-out.route.tsx')

					route('/todo', 'routes/todo/todo.route.tsx', { index: true })

					route('/api/completion', 'routes/api/completion.route.ts')
					route('/api/health', 'routes/api/health.route.ts')

					route('/server-error', 'routes/server-error/server-error.route.tsx')

					route('/', 'routes/layout.route.tsx', () => {
						route('c?/:conversation-id?', 'routes/conversation/conversation.route.tsx', { index: true })
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
