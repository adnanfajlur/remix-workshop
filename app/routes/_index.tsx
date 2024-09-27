import { Button } from '@mantine/core'
import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Remix workshop' },
		{ name: 'description', content: 'Welcome to Remix workshop!' },
	]
}

export default function Index() {
	return (
		<div className="flex flex-col h-screen items-center justify-center gap-4">
			<p>Hello world</p>
			<Button>Click me</Button>
		</div>
	)
}
