import { ActionIcon, AppShell, Avatar, Box, Burger, Button, Group, Menu, ScrollArea, Skeleton, Text, Title, Tooltip } from '@mantine/core'
import { useDisclosure, useSetState } from '@mantine/hooks'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { IconChevronRight, IconDots, IconEdit, IconLayoutSidebar, IconLogout, IconMenu, IconMenu2, IconX } from '@tabler/icons-react'
import { getUserSession } from '~/handlers'
import { prisma } from '~/libs/prisma.server'
import { cn } from '~/utils/cn'
import { ConversationMenu } from './conversation-menu'

export async function loader({ request, context }: LoaderFunctionArgs) {
	const { user } = await getUserSession(request)

	const conversations = await prisma.conversation.findMany({
		where: { userId: user.id },
		orderBy: { updatedAt: 'desc' },
		select: {
			id: true,
			title: true,
			updatedAt: true,
		},
	})

	return {
		user,
		conversations,
	}
}

export default function LayoutRoute() {
	const { user, conversations } = useLoaderData<typeof loader>()

	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)

	return (
		<AppShell
			layout="alt"
			header={{ height: 60 }}
			navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !mobileOpened, desktop: !desktopOpened } }}
			padding="lg"
		>
			<AppShell.Header withBorder={false}>
				<div className="flex h-full items-center px-[20px] justify-between sm:justify-normal gap-4">
					<Box visibleFrom="sm" className={cn('flex items-center', { hidden: desktopOpened })}>
						<Tooltip label="Open sidebar">
							<ActionIcon color="dark.7" size="40px" onClick={toggleDesktop}>
								<IconLayoutSidebar size={22} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label="New chat">
							<ActionIcon color="dark.7" size="40px">
								<IconEdit size={22} />
							</ActionIcon>
						</Tooltip>
					</Box>

					<ActionIcon color="dark.7" c="dark.0" size="lg" hiddenFrom="sm" onClick={toggleMobile}>
						<IconMenu2 />
					</ActionIcon>
					<Title order={2} h={32} className="text-dark-0 sm:text-white">Chat</Title>
					<ActionIcon color="dark.7" size="lg" c="dark.0" hiddenFrom="sm">
						<IconEdit />
					</ActionIcon>

					<Menu position="bottom-end" width={160}>
						<Menu.Target>
							<Avatar name={user.name} size="42px" visibleFrom="sm" className="ml-auto cursor-pointer" />
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item leftSection={<IconLogout size={22} />} component={Link} to="/auth/log-out">
								Log out
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</div>
			</AppShell.Header>

			<AppShell.Navbar p="md" pt="sm" bg="dark.8" withBorder={false}>
				<div className="flex flex-col gap-1">
					<Tooltip label="Close sidebar">
						<ActionIcon color="dark.8" size="40px" visibleFrom="sm" onClick={toggleDesktop}>
							<IconLayoutSidebar size={22} />
						</ActionIcon>
					</Tooltip>
					<ActionIcon color="dark.8" size="40px" hiddenFrom="sm" onClick={toggleMobile}>
						<IconX />
					</ActionIcon>
					<Button
						fullWidth
						justify="flex-start"
						px="xs"
						size="md"
						color="dark.8"
						leftSection={<IconEdit size={22} />}
						component={Link}
						to="/c"
					>
						New chat
					</Button>
				</div>

				<ScrollArea
					offsetScrollbars
					className="mt-6 mr-[-12px]"
					scrollbars="y"
					classNames={{ viewport: '[&>div]:!block' }}
				>
					<div className="flex flex-col">
						{conversations.map((conversation) => (
							<ConversationMenu
								conversationId={conversation.id}
								title={conversation.title}
								key={conversation.id}
							/>
						))}
					</div>
				</ScrollArea>

				<Menu position="top-start" width="target">
					<Menu.Target>
						<Box hiddenFrom="sm" className="flex cursor-pointer gap-4 items-center px-[11px] py-2 mt-2 mb-[-8px] hover:bg-dark-5 rounded-lg">
							<Avatar name={user.name} size="36px" hiddenFrom="sm" />
							<Text>{user.name}</Text>
						</Box>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item leftSection={<IconLogout size={22} />} component={Link} to="/auth/log-out">
							Log out
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</AppShell.Navbar>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	)
}
