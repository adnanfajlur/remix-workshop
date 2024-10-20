import { ActionIcon, Card, Container, Loader, ScrollArea, Text, Textarea } from '@mantine/core'
import { useMounted, useSetState } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { ActionFunctionArgs, json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useFetcher, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react'
import { IconArrowUp, IconBrandReact } from '@tabler/icons-react'
import { useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import * as yup from 'yup'
import CustomMarkdown from '~/components/custom-markdown'
import { getUserSession } from '~/handlers'
import { prisma } from '~/libs/prisma.server'
import { ConversationWithMessagesType, MessageType } from '~/types'
import classes from './conversation.route.module.css'

const CONVERSATION_SUGGESTIONS = [
	'Create a workout plan',
	'Python script for daily email reports',
	'Write a report based on my data',
	'Summarize a long document',
]

const CONTAINER_SIZE = 820

export const meta: MetaFunction = () => {
	return [
		{ title: 'Chat - Remix workshop' },
	]
}

export async function loader({ request, params }: LoaderFunctionArgs) {
	const { user } = await getUserSession(request)

	let conversation: ConversationWithMessagesType | null = null

	if (params['conversation-id']) {
		conversation = await prisma.conversation.findFirst({
			where: { id: params['conversation-id'], userId: user.id, deletedAt: null },
			include: {
				messages: {
					orderBy: {
						createdAt: 'asc',
					},
				},
			},
		})
	}

	return { conversation }
}

export async function action({ request, params }: ActionFunctionArgs) {
	const { user } = await getUserSession(request)

	const conversationId = params['conversation-id']

	if (conversationId) {
		const formData = await request.formData()
		const intent = formData.get('intent') as 'update' | 'delete'

		if (intent === 'update') {
			const title = formData.get('title') as string
			if (!title) {
				return json({ message: 'Title is required' }, { status: 400 })
			}

			await prisma.conversation.update({
				where: { id: conversationId, userId: user.id, deletedAt: null },
				data: { title },
			})

			return json({ success: true })
		}

		if (intent === 'delete') {
			await prisma.conversation.update({
				where: { id: conversationId, userId: user.id, deletedAt: null },
				data: { deletedAt: new Date() },
			})

			return json({ success: true })
		}
	}

	return json({ message: 'Action not found' }, { status: 400 })
}

export default function ChatRoute() {
	const { conversation } = useLoaderData<typeof loader>()
	const navigate = useNavigate()
	const revalidator = useRevalidator()

	const viewport = useRef<HTMLDivElement>(null)

	const [state, setState] = useSetState({
		completion: null as string | null,
		messages: conversation?.messages || [] as MessageType[],
		isLoading: false,
	})

	function handleSubmitMessage(content: string) {
		setState((prev) => ({
			messages: [
				...prev.messages,
				{ id: crypto.randomUUID(), content, sender: 'user', createdAt: new Date() },
			],
		}))

		fetchCompletion(content)
	}

	function scrollToBottom() {
		if (viewport.current) {
			viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' })
		}
	}

	async function fetchCompletion(content: string) {
		try {
			setState({ isLoading: true })

			const formData = new FormData()
			formData.set('content', content || '')

			if (conversation) {
				formData.set('id', conversation.id)
			}

			const resp = await fetch(`/api/completion`, {
				method: 'POST',
				body: formData,
			})

			if (resp.body) {
				const reader = resp.body.getReader()
				const decoder = new TextDecoder('utf-8')

				let isNewConversation = false

				while (true) {
					const { done, value } = await reader.read()

					if (done) break

					const chunk = decoder.decode(value)
					const lines = chunk.split('\n\n')

					for (const line of lines) {
						if (line.startsWith('event:')) {
							const [eventLine, dataLine] = line.split('\n')
							const event = eventLine.slice(7).trim()
							const data = dataLine.slice(5).trim()
							try {
								const parsedData = JSON.parse(data) || ''

								if (event === 'new-conversation' && parsedData.conversation?.id) {
									isNewConversation = true
									navigate(`/c/${parsedData.conversation.id}`, { state: { skipNProgress: true } })
								}

								if (event === 'user-msg' && parsedData.message?.id) {
									setState((prev) => ({ messages: [...prev.messages.slice(0, -1), parsedData.message] }))
								}

								if (event === 'msg') {
									setState((prev) => ({ completion: (prev.completion || '') + (parsedData.content || '') }))
								}

								if (event === 'assistant-msg' && parsedData.message?.id) {
									setState((prev) => ({
										messages: [...prev.messages, parsedData.message],
										completion: null,
									}))
								}
							} catch (error) {
								console.error('Error parsing data:', error)
								notifications.show({ color: 'red', title: 'Error parsing data', message: error.message })
							}
						}
					}
				}

				if (isNewConversation) {
					revalidator.revalidate()
				}
			}
		} catch (error) {
			notifications.show({ color: 'red', title: 'Error fetching completion', message: error.message })
		} finally {
			setState({ isLoading: false })
		}
	}

	useEffect(() => {
		if (conversation?.id) {
			setState({ messages: conversation.messages, completion: null })
		} else {
			setState({ messages: [], completion: null })
		}
	}, [conversation?.id])

	return (
		<div
			className="flex flex-col"
			style={{
				margin: 'calc(-1 * var(--app-shell-padding, 0rem))',
				height: 'calc(100vh - var(--app-shell-header-offset, 0rem))',
			}}
		>
			{!state.messages.length
				? (
					<Container size={CONTAINER_SIZE} className="w-full grow flex flex-col items-center justify-center">
						<IconBrandReact size={52} stroke={1.4} />
						<div className="grid grid-cols-2 gap-4 mt-10">
							{CONVERSATION_SUGGESTIONS.map((suggestion) => (
								<Card
									withBorder
									component="button"
									radius="12px"
									className="text-left bg-transparent hover:bg-dark-6 text-[15px]"
									key={suggestion}
									onClick={() => handleSubmitMessage(suggestion)}
								>
									<span className="line-clamp-3 text-balance">{suggestion}</span>
								</Card>
							))}
						</div>
					</Container>
				)
				: (
					<ScrollArea scrollbars="y" classNames={{ viewport: '[&>div]:!block' }} viewportRef={viewport}>
						<div className="flex flex-col gap-7 grow pt-6 pb-10">
							{state.messages.map((message) => {
								if (message.sender === 'user') {
									return (
										<Container size={CONTAINER_SIZE} className="w-full" key={message.id}>
											<div className="bg-dark-6 w-fit max-w-[70%] rounded-3xl px-5 py-2.5 text-white ml-auto">
												{message.content}
											</div>
										</Container>
									)
								} else {
									return (
										<Container size={CONTAINER_SIZE} className="w-full flex gap-3 md:gap-5 lg:gap-6" key={message.id}>
											<div className="text-dark-0 rounded-full border border-dark-4 h-fit p-1.5">
												<IconBrandReact size={20} stroke={1.4} />
											</div>
											<div className="grow text-white pt-1.5 overflow-y-scroll">
												<CustomMarkdown children={message.content} />
											</div>
										</Container>
									)
								}
							})}

							{typeof state.completion === 'string' && (
								<Container size={CONTAINER_SIZE} className="w-full flex gap-3 md:gap-5 lg:gap-6">
									<div className="text-dark-0 rounded-full border border-dark-4 h-fit p-1.5">
										<IconBrandReact size={20} stroke={1.4} />
									</div>
									<div className="grow text-white pt-1.5">
										{state.completion === ''
											? <Loader type="dots" color="white" />
											: <CustomMarkdown children={state.completion} />}
									</div>
								</Container>
							)}
						</div>
					</ScrollArea>
				)}

			<Container size={CONTAINER_SIZE} className="w-full mt-auto">
				<ChatInput isLoading={state.isLoading} handleSubmit={handleSubmitMessage} />

				<Text className="text-xs text-center" px="md" py="8px">
					Chat can make mistakes. Check important info.
				</Text>
			</Container>
		</div>
	)
}

type ChatInputProps = {
	handleSubmit: (value: string) => void
	isLoading: boolean
}

function ChatInput({ handleSubmit, isLoading }: ChatInputProps) {
	const isMounted = useMounted()

	const [state, setState] = useSetState({
		value: '',
	})

	const trimmedValue = state.value.trim()

	function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setState({ value: e.target.value })
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			if (trimmedValue && !isLoading) {
				handleSubmit(state.value)
				setState({ value: '' })
			}
		}
	}

	// Textarea issue: causing cls on hydration process
	// https://github.com/mantinedev/mantine/issues/6719#issuecomment-2309326434

	if (!isMounted) {
		return <div className="h-[51px]" />
	}

	return (
		<Textarea
			autosize
			autoFocus
			variant="filled"
			radius="26px"
			size="md"
			placeholder="Message Chat"
			minRows={1}
			maxRows={8}
			value={state.value}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
			disabled={isLoading}
			classNames={{
				input: '!border-none pl-[24px] pr-[46px] py-[13px] placeholder:text-dark-1 text-white',
				section: 'end-[6px]',
			}}
			rightSection={
				<ActionIcon
					variant="white"
					radius="100%"
					size="32px"
					classNames={{ root: classes['send-button'] }}
					disabled={!trimmedValue}
					loading={isLoading}
				>
					<IconArrowUp />
				</ActionIcon>
			}
		/>
	)
}
