import { ActionIcon, Button, Menu } from '@mantine/core'
import type { MetaFunction } from '@remix-run/node'
import { IconArrowBack, IconDots } from '@tabler/icons-react'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Chat - Remix workshop' },
	]
}

export default function ChatRoute() {
	return (
		<div>
			<p className="text-white">Chat page</p>
		</div>
	)
}
