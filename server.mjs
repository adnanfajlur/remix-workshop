import { createRequestHandler } from '@remix-run/express'
import { installGlobals } from '@remix-run/node'
import express from 'express'
import 'dotenv/config'

installGlobals()

const viteDevServer = process.env.NODE_ENV === 'production'
	? undefined
	: await import('vite').then((vite) =>
		vite.createServer({
			server: { middlewareMode: true },
		})
	)

const app = express()

// handle asset requests
if (viteDevServer) {
	app.use(viteDevServer.middlewares)
} else {
	app.use(
		'/assets',
		express.static('build/client/assets', {
			immutable: true,
			maxAge: '1y',
		}),
	)
}
app.use(express.static('build/client', { maxAge: '1h' }))

// handle SSR requests
app.all(
	'*',
	createRequestHandler({
		build: viteDevServer
			? () =>
				viteDevServer.ssrLoadModule(
					'virtual:remix/server-build',
				)
			: await import('./build/server/index.js'),
		getLoadContext: () => ({
			test: '123',
		}),
	}),
)

const port = 3000
app.listen(port, () => console.log('http://localhost:' + port))
