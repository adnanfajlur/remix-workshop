// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'
import 'virtual:uno.css'

import { ColorSchemeScript, MantineColorScheme, MantineProvider } from '@mantine/core'
import type { LinksFunction } from '@remix-run/node'
import { isRouteErrorResponse, Links, Meta, MetaFunction, Outlet, Scripts, ScrollRestoration, useRouteError } from '@remix-run/react'
import { theme, themeVarResolver } from './libs/theme.lib'

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
	{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap' },
]

export const meta: MetaFunction = () => {
	return [
		{ name: 'description', content: 'Welcome to Remix workshop!' },
	]
}

const DEFAULT_COLOR_SCHEME: MantineColorScheme = 'light'

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<ColorSchemeScript defaultColorScheme={DEFAULT_COLOR_SCHEME} />
			</head>
			<body>
				<MantineProvider
					defaultColorScheme={DEFAULT_COLOR_SCHEME}
					theme={theme}
					cssVariablesResolver={themeVarResolver}
				>
					{children}
				</MantineProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return <Outlet />
}

export function ErrorBoundary() {
	const error = useRouteError()
	console.log('logdev', error)

	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<h1>
					{error.status} {error.statusText}
				</h1>
				<p>{error.data}</p>
			</div>
		)
	} else if (error instanceof Error) {
		return (
			<div>
				<h1>Error</h1>
				<p>{error.message}</p>
				{error.stack && (
					<>
						<p>The stack trace is:</p>
						<pre>{error.stack}</pre>
					</>
				)}
			</div>
		)
	} else {
		return <h1>Unknown Error</h1>
	}
}
