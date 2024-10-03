import { AppShell, Burger, Group, Skeleton, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { getUserSession } from '~/handlers'

export async function loader({ request, context }: LoaderFunctionArgs) {
	const { user } = await getUserSession(request)

	return {
		user,
	}
}

export default function LayoutRoute() {
	const { user } = useLoaderData<typeof loader>()

	const [opened, { toggle }] = useDisclosure()

	return (
		<AppShell
			layout="alt"
			header={{ height: 60 }}
			navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
			padding="md"
		>
			<AppShell.Header withBorder={false}>
				<Group h="100%" px="md">
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
					<Title order={2}>Chat</Title>
				</Group>
			</AppShell.Header>
			<AppShell.Navbar p="md" bg="dark.9">
				<Group>
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
					<Text>Navbar</Text>
				</Group>
				{Array(15)
					.fill(0)
					.map((_, index) => <Skeleton key={index} h={28} mt="sm" animate={false} />)}
			</AppShell.Navbar>
			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	)
}
