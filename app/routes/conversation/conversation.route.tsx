import { ActionIcon, Card, Container, convertCssVariables, convertHsvaTo, Loader, Paper, ScrollArea, Text, Textarea } from '@mantine/core'
import { useMounted, useSetState } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { Conversation, Message } from '@prisma/client'
import { ActionFunctionArgs, json, LoaderFunctionArgs, type MetaFunction, redirect } from '@remix-run/node'
import { useFetcher, useLoaderData, useNavigate, useRevalidator } from '@remix-run/react'
import { IconArrowUp, IconBrandReact } from '@tabler/icons-react'
import { useEffect, useMemo } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import * as yup from 'yup'
import { getUserSession } from '~/handlers'
import { openai } from '~/libs/openai.server'
import { prisma } from '~/libs/prisma.server'
import { yupAction } from '~/utils/yup-action'
import classes from './conversation.route.module.css'

const CONVERSATION_SUGGESTIONS = [
	'Create a workout plan',
	'Python script for daily email reports',
	'Write a report based on my data',
	'Summarize a long document',
]

const createConversationSchema = yup.object({
	content: yup.string().required(),
}).noUnknown()

type MessageType = Pick<Message, 'id' | 'content' | 'sender' | 'createdAt'>

type ConversationType = Conversation & {
	messages: MessageType[]
}

export const meta: MetaFunction = () => {
	return [
		{ title: 'Chat - Remix workshop' },
	]
}

export async function loader({ request, params }: LoaderFunctionArgs) {
	const { user } = await getUserSession(request)

	let conversation: ConversationType & {
		isFresh?: boolean
	} | null = null

	if (params['conversation-id']) {
		conversation = await prisma.conversation.findFirst({
			where: { id: params['conversation-id'], userId: user.id },
			include: {
				messages: {
					orderBy: {
						createdAt: 'asc',
					},
				},
			},
		})

		if (conversation) {
			conversation.isFresh = conversation.messages.length === 1
		}
	}

	return { conversation }
}

export default function ChatRoute() {
	const navigate = useNavigate()
	const fetcher = useFetcher()
	const revalidator = useRevalidator()

	const { conversation } = useLoaderData<typeof loader>()

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
									navigate(`/c/${parsedData.conversation.id}`)
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
					<Container size="sm" className="w-full grow flex flex-col items-center justify-center">
						<IconBrandReact size={52} stroke={1.4} />
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
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
					<ScrollArea scrollbars="y">
						<div className="flex flex-col gap-7 grow pt-6 pb-10">
							{state.messages.map((message) => {
								if (message.sender === 'user') {
									return (
										<Container size="sm" className="w-full" key={message.id}>
											<div className="bg-dark-6 w-fit max-w-[70%] rounded-3xl px-5 py-2.5 text-white whitespace-pre-wrap ml-auto">
												{message.content}
											</div>
										</Container>
									)
								} else {
									return (
										<Container size="sm" className="w-full flex gap-4 md:gap-5 lg:gap-6" key={message.id}>
											<div className="text-dark-0 rounded-full border border-dark-4 h-fit p-1.5">
												<IconBrandReact size={24} stroke={1.4} />
											</div>
											<div className="grow text-white whitespace-pre-wrap pt-1.5">
												<Markdown remarkPlugins={[remarkGfm]} className="markdown">{message.content}</Markdown>
											</div>
										</Container>
									)
								}
							})}

							{typeof state.completion === 'string' && (
								<Container size="sm" className="w-full flex gap-4 md:gap-5 lg:gap-6">
									<div className="text-dark-0 rounded-full border border-dark-4 h-fit p-1.5">
										<IconBrandReact size={24} stroke={1.4} />
									</div>
									<div className="grow text-white whitespace-pre-wrap pt-1.5">
										{state.completion === ''
											? <Loader type="dots" color="white" />
											: <Markdown remarkPlugins={[remarkGfm]} className="markdown">{state.completion}</Markdown>}
									</div>
								</Container>
							)}
						</div>
					</ScrollArea>
				)}

			<Container className="w-full mt-auto" size="sm">
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
