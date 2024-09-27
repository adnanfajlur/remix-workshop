import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Remix workshop' },
		{ name: 'description', content: 'Welcome to Remix workshop!' },
	]
}

export default function Index() {
	return (
		<div className="flex h-screen items-center justify-center">
			<p>Hello world</p>
		</div>
	)
}
