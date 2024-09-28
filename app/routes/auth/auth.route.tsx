import { Button } from '@mantine/core'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '~/libs/prisma.lib.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const users = await prisma.user.findMany()

	const now = new Date()

	return { users, now }
}

export const meta: MetaFunction = () => {
	return [
		{ title: 'Auth - Remix workshop' },
	]
}

export default function AuthRoute() {
	const data = useLoaderData<typeof loader>()

	console.log('logdev', typeof data.now) // should return object / date class

	return (
		<div>
			<p>Auth page</p>
		</div>
	)
}
