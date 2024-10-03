import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { getUserSession } from '~/handlers'

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
