// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import './root.css'
import './markdown.css'
import './fonts.css'

import { Button, ColorSchemeScript, Container, Group, MantineProvider, Text, Title } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import type { LinksFunction } from '@remix-run/node'
import { isRouteErrorResponse, Link, Links, Meta, MetaFunction, Outlet, Scripts, ScrollRestoration, useRevalidator, useRouteError } from '@remix-run/react'
import { theme, themeVarResolver } from './libs/theme'

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

const DEFAULT_COLOR_SCHEME = 'dark'

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<ColorSchemeScript forceColorScheme={DEFAULT_COLOR_SCHEME} />
			</head>
			<body>
				<MantineProvider
					forceColorScheme={DEFAULT_COLOR_SCHEME}
					theme={theme}
					cssVariablesResolver={themeVarResolver}
				>
					<Notifications position="top-right" />
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
	const revalidator = useRevalidator()

	function handleRefresh() {
		if (revalidator.state === 'idle') {
			revalidator.revalidate()
		}
	}

	if (isRouteErrorResponse(error)) {
		let code = error.status
		let message = error.statusText
		let description = error.data

		if (code === 404) {
			message = 'You have found a secret place'
			description = 'Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has been moved to another URL.'
		}

		return (
			<div className="py-20 min-h-screen">
				<Container>
					<div className="text-center text-5xl text-gray-3 font-[900] leading-none mb-12">{code}</div>
					<Title className="text-center font-[900] text-[32px] sm:text-[38px]">{message}</Title>
					<Text size="lg" ta="center" c="dimmed" className="max-w-[540px] m-auto mt-8 mb-12">
						{description}
					</Text>
					<Group justify="center">
						<Button variant="default" size="md" component={Link} to="/">
							Take me back to home page
						</Button>
					</Group>
				</Container>
			</div>
		)
	}

	if (error instanceof Error) {
		return (
			<div className="py-20 min-h-screen bg-blue-6">
				<Container>
					<div className="text-center text-[120px] sm:text-[220px] text-blue-3 font-[900] leading-none mb-12">500</div>
					<Title className="text-center font-[900] text-white text-[32px] sm:text-[38px]">Something bad just happened...</Title>
					<Text size="lg" ta="center" className="max-w-[540px] m-auto text-blue-1 mt-8 mb-12">
						Our servers could not handle your request. Don&apos;t worry, our development team was already notified. Try refreshing the page.
					</Text>
					<Group justify="center">
						<Button variant="white" size="md" onClick={handleRefresh}>
							Refresh the page
						</Button>
					</Group>
				</Container>
			</div>
		)
	}

	return <h1>Unknown Error</h1>
}
