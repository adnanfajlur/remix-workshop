import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Chat - Remix workshop' },
	]
}

export default function ChatRoute() {
	return (
		<div>
			<p>Chat page</p>
		</div>
	)
}
