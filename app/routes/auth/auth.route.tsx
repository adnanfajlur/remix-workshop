import { Button } from '@mantine/core'
import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Auth - Remix workshop' },
	]
}

export default function AuthRoute() {
	return (
		<div>
			<p>Auth page</p>
		</div>
	)
}
