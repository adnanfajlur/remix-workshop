// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'
import 'virtual:uno.css'

import { Button, ColorSchemeScript, Container, Group, MantineColorScheme, MantineProvider, Text, Title } from '@mantine/core'
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

	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<h1>
					{error.status} {error.statusText}
				</h1>
				<p>{error.data}</p>
			</div>
		)
	}

	if (error instanceof Error) {
		return (
			<div className="pt-[80px] pb-[120px] bg-blue-6">
				<Container>
					<div className="text-center text-[13.75rem] text-blue-3 font-900 leading-none mb-12">500</div>
				</Container>
				<Title>Something bad just happened...</Title>
				<Text size="lg" ta="center">
					Our servers could not handle your request. Don&apos;t worry, our development team was already notified. Try refreshing the page.
				</Text>
				<Group justify="center">
					<Button variant="white" size="md">
						Refresh the page
					</Button>
				</Group>
			</div>
		)
	}

	return <h1>Unknown Error</h1>
}
