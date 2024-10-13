import { ActionIcon, AppShell, Avatar, Box, Button, Menu, Modal, ScrollArea, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { useDisclosure, useSetState } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { nprogress } from '@mantine/nprogress'
import { LoaderFunctionArgs } from '@remix-run/node'
import { Link, Outlet, useLoaderData, useNavigate, useNavigation, useParams, useRevalidator } from '@remix-run/react'
import { IconEdit, IconLayoutSidebar, IconLogout, IconMenu2, IconX } from '@tabler/icons-react'
import { useEffect } from 'react'
import { getUserSession } from '~/handlers'
import { prisma } from '~/libs/prisma.server'
import { ConversationType } from '~/types'
import { cn } from '~/utils/cn'
import { ConversationMenu } from './conversation-menu'

export async function loader({ request, context }: LoaderFunctionArgs) {
	const { user } = await getUserSession(request)

	const conversations = await prisma.conversation.findMany({
		where: { userId: user.id, deletedAt: null },
		orderBy: { updatedAt: 'desc' },
		take: 30,
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
	const revalidator = useRevalidator()
	const params = useParams()
	const navigate = useNavigate()

	const [state, setState] = useSetState({
		updateConversation: null as ConversationType | null,
		deleteConversation: null as ConversationType | null,

		isLoadingUpdate: false,
		isLoadingDelete: false,

		mobileOpened: false,
		desktopOpened: true,
	})

	const updateForm = useForm({
		mode: 'uncontrolled',
		initialValues: {
			title: '',
		},
		validate: {
			title: isNotEmpty('Title is required'),
		},
	})

	async function handleUpdate(values: typeof updateForm.values) {
		if (!state.updateConversation) return

		try {
			setState({ isLoadingUpdate: true })

			const formData = new FormData()
			formData.append('intent', 'update')
			formData.append('title', values.title)

			await fetch(`/c/${state.updateConversation.id}`, {
				method: 'PATCH',
				body: formData,
			})

			notifications.show({ color: 'green', title: 'Title updated', message: 'Title has been updated successfully' })
			revalidator.revalidate()
		} catch (error) {
			console.error(error)
			notifications.show({ color: 'red', title: 'Error updating title', message: error.message })
		} finally {
			setState({ isLoadingUpdate: false, updateConversation: null })
		}
	}

	async function handleDelete() {
		if (!state.deleteConversation) return

		try {
			setState({ isLoadingDelete: true })

			const formData = new FormData()
			formData.append('intent', 'delete')

			await fetch(`/c/${state.deleteConversation.id}`, {
				method: 'DELETE',
				body: formData,
			})

			notifications.show({ color: 'green', title: 'Conversation deleted', message: 'Conversation has been deleted successfully' })

			if (params['conversation-id'] === state.deleteConversation.id) {
				navigate('/')
			} else {
				revalidator.revalidate()
			}
		} catch (error) {
			console.error(error)
			notifications.show({ color: 'red', title: 'Error deleting conversation', message: error.message })
		} finally {
			setState({ isLoadingDelete: false, deleteConversation: null })
		}
	}

	return (
		<AppShell
			layout="alt"
			header={{ height: 60 }}
			navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !state.mobileOpened, desktop: !state.desktopOpened } }}
			padding="lg"
		>
			<WatchNavigationProgress />

			<Modal
				title="Update title"
				opened={!!state.updateConversation}
				onClose={() => setState({ updateConversation: null })}
				closeOnClickOutside={false}
				closeOnEscape={false}
				closeButtonProps={{ disabled: state.isLoadingUpdate }}
			>
				<form onSubmit={updateForm.onSubmit(handleUpdate)}>
					<TextInput
						placeholder="Enter new title"
						key={updateForm.key('title')}
						{...updateForm.getInputProps('title')}
					/>
					<div className="mt-6 flex justify-end">
						<Button type="submit" color="dark.6" loading={state.isLoadingUpdate}>Submit</Button>
					</div>
				</form>
			</Modal>

			<Modal
				title="Delete conversation"
				opened={!!state.deleteConversation}
				onClose={() => setState({ deleteConversation: null })}
				closeButtonProps={{ disabled: state.isLoadingDelete }}
			>
				<Text>Are you sure you want to delete this conversation?</Text>

				<div className="mt-6 flex justify-end gap-2">
					<Button color="dark.7" disabled={state.isLoadingDelete} onClick={() => setState({ deleteConversation: null })}>Cancel</Button>
					<Button color="red.8" loading={state.isLoadingDelete} onClick={handleDelete}>Delete</Button>
				</div>
			</Modal>

			<AppShell.Header withBorder={false}>
				<div className="flex h-full items-center px-[20px] justify-between sm:justify-normal gap-4">
					<Box visibleFrom="sm" className={cn('flex items-center', { hidden: state.desktopOpened })}>
						<Tooltip label="Open sidebar">
							<ActionIcon color="dark.7" size="40px" onClick={() => setState({ desktopOpened: false })}>
								<IconLayoutSidebar size={22} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label="New chat">
							<ActionIcon color="dark.7" size="40px">
								<IconEdit size={22} />
							</ActionIcon>
						</Tooltip>
					</Box>

					<ActionIcon color="dark.7" c="dark.0" size="lg" hiddenFrom="sm" onClick={() => setState({ mobileOpened: true })}>
						<IconMenu2 />
					</ActionIcon>
					<Title order={2} h={32} className="text-dark-0 sm:text-white">Chat</Title>
					<ActionIcon color="dark.7" size="lg" c="dark.0" hiddenFrom="sm" component={Link} to="/">
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
						<ActionIcon color="dark.8" size="40px" visibleFrom="sm" onClick={() => setState({ desktopOpened: true })}>
							<IconLayoutSidebar size={22} />
						</ActionIcon>
					</Tooltip>
					<ActionIcon color="dark.8" size="40px" hiddenFrom="sm" onClick={() => setState({ mobileOpened: false })}>
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
						to="/"
						onClick={() => setState({ mobileOpened: false })}
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
								conversation={conversation}
								key={conversation.id}
								onUpdate={(conversation) => {
									updateForm.setValues({ title: conversation.title })
									setState({ updateConversation: conversation })
								}}
								onDelete={(conversation) => setState({ deleteConversation: conversation })}
								onClick={() => setState({ mobileOpened: false })}
							/>
						))}
					</div>
				</ScrollArea>

				<Menu position="top-start" width="target">
					<Menu.Target>
						<Box hiddenFrom="sm" className="flex cursor-pointer gap-4 items-center px-[11px] py-2 hover:bg-dark-5 rounded-lg mt-auto">
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

function WatchNavigationProgress() {
	const navigation = useNavigation()

	useEffect(() => {
		const skipNProgress = navigation.location?.state?.skipNProgress

		if (navigation.state !== 'idle' && !skipNProgress) {
			nprogress.start()
		} else {
			nprogress.complete()
		}
	}, [navigation.state])

	return null
}
