import { ActionIcon, Avatar, Box, Button, Checkbox, Container, Menu, Overlay, Paper, ScrollArea, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { useSetState } from '@mantine/hooks'
import { NotificationData, notifications } from '@mantine/notifications'
import { ActionFunctionArgs, json, LoaderFunctionArgs, MetaFunction, unstable_data } from '@remix-run/node'
import { Form, Link, useActionData, useFetcher, useLoaderData, useSubmit } from '@remix-run/react'
import { IconLogout, IconPencil, IconTrash } from '@tabler/icons-react'
import { sleep } from 'radash'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import CustomMarkdown from '~/components/custom-markdown'
import { getUserSession } from '~/handlers'
import { prisma } from '~/libs/prisma.server'
import { cn } from '~/utils/cn'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Todo - Remix workshop' },
	]
}

export async function loader({ request }: LoaderFunctionArgs) {
	const { user } = await getUserSession(request)

	const todos = await prisma.todo.findMany({
		where: { userId: user.id, deletedAt: null },
		orderBy: { createdAt: 'desc' },
	})

	return { user, todos }
}

export async function action({ request }: ActionFunctionArgs) {
	const { user } = await getUserSession(request)

	const formData = await request.formData()
	const intent = String(formData.get('intent'))
	const method = request.method
	const now = new Date()

	if (intent === 'create' && method === 'POST') {
		const content = String(formData.get('content'))

		if (!content) {
			return json(
				{ errors: { content: 'Input field is required' } },
				{ status: 400 },
			)
		}

		await prisma.todo.create({
			data: { content, userId: user.id },
		})

		return json({
			notif: {
				message: 'Todo created',
				color: 'green',
			} as NotificationData,
		})
	}

	if (intent === 'complete' && method === 'PATCH') {
		const id = String(formData.get('id'))
		const complete = String(formData.get('complete')) === 'true'

		await prisma.todo.update({
			where: { id, userId: user.id },
			data: { completedAt: complete ? now : null },
		})

		return json({
			notif: {
				message: complete ? 'Todo completed' : 'Todo uncompleted',
				color: 'green',
			} as NotificationData,
		})
	}

	if (intent === 'delete' && method === 'DELETE') {
		const id = String(formData.get('id'))

		await prisma.todo.update({
			where: { id, userId: user.id },
			data: { deletedAt: now },
		})

		return json({
			notif: {
				message: 'Todo deleted',
				color: 'green',
			} as NotificationData,
		})
	}

	return json({
		notif: {
			message: 'Action not found',
			color: 'red',
		} as NotificationData,
	}, { status: 400 })
}

export default function TodoRoute() {
	const { user, todos } = useLoaderData<typeof loader>()
	const fetcher = useFetcher<typeof action>()

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			content: '',
		},
	})

	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data) {
			const errors = 'errors' in fetcher.data ? fetcher.data.errors : undefined
			const notif = 'notif' in fetcher.data ? fetcher.data.notif : undefined

			if (errors) {
				form.setErrors(errors)
			} else {
				form.reset()
			}

			if (notif) {
				notifications.show({ message: String(notif.message), color: notif.color })
			}
		}
	}, [fetcher.state, fetcher.data])

	const intent = fetcher.formData?.get('intent')
	const id = fetcher.formData?.get('id')

	const isLoadingCreate = fetcher.state !== 'idle' && fetcher.formMethod === 'POST' && intent === 'create'
	const isLoadingUpdate = fetcher.state !== 'idle' && fetcher.formMethod === 'PATCH' && intent === 'update'
	const isLoadingDelete = fetcher.state !== 'idle' && fetcher.formMethod === 'DELETE' && intent === 'delete'

	return (
		<Container size="sm" py="xl">
			<div className="flex gap-4 justify-between items-center">
				<Title c="white">Todo list</Title>

				<Menu position="top-end" width={160}>
					<Menu.Target>
						<Avatar name={user.name} size="42px" className="cursor-pointer" />
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item leftSection={<IconLogout size={22} />} component={Link} to="/auth/log-out">
							Log out
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</div>

			<fetcher.Form
				className="mt-10 flex gap-2"
				onSubmit={(e) => {
					form.onSubmit((values) => {
						fetcher.submit(
							{ intent: 'create', content: values.content },
							{ method: 'POST' },
						)
					})(e)
				}}
			>
				<input
					type="hidden"
					key={form.key('id')}
					{...form.getInputProps('id')}
				/>

				<TextInput
					autoComplete="off"
					placeholder="Add todo"
					variant="filled"
					size="md"
					classNames={{
						root: 'grow',
						input: '!border-none text-white',
					}}
					disabled={isLoadingCreate || isLoadingUpdate}
					key={form.key('content')}
					{...form.getInputProps('content')}
				/>
				<Button
					size="md"
					color="dark.5"
					type="submit"
					loading={isLoadingCreate || isLoadingUpdate}
				>
					Submit
				</Button>
			</fetcher.Form>

			<div className="mt-8 flex flex-col gap-3">
				{todos.map((todo) => {
					const isDeleting = isLoadingDelete && id === todo.id
					const isCompleted = !!todo.completedAt

					return (
						<Paper key={todo.id} className="px-4 py-2 flex items-center gap-2 relative overflow-hidden" withBorder>
							{isDeleting && <Overlay color="#3b3b3b" backgroundOpacity={0.4} blur={0.8} />}

							<Checkbox
								className="mr-2.5"
								color="white"
								size="26px"
								defaultChecked={isCompleted}
								onChange={(e) => {
									fetcher.submit({ intent: 'complete', id: todo.id, complete: e.target.checked }, { method: 'PATCH' })
								}}
							/>

							<Text className={cn('grow text-white', { 'line-through': isCompleted })}>{todo.content}</Text>

							<div className="flex items-center">
								<Tooltip label="Delete" openDelay={500}>
									<ActionIcon
										variant="subtle"
										color="red.7"
										size="lg"
										loading={isDeleting}
										onClick={() => {
											fetcher.submit({ intent: 'delete', id: todo.id }, { method: 'DELETE' })
										}}
									>
										<IconTrash stroke={1.4} size={22} />
									</ActionIcon>
								</Tooltip>
							</div>
						</Paper>
					)
				})}

				{todos.length === 0 && <Text className="text-white text-center mt-12">No todos found</Text>}
			</div>
		</Container>
	)
}
