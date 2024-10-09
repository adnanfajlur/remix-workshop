import { ActionIcon, Card, Container, Paper, ScrollArea, Text, Textarea } from '@mantine/core'
import { useMounted, useSetState } from '@mantine/hooks'
import { Conversation, Message } from '@prisma/client'
import { ActionFunctionArgs, json, LoaderFunctionArgs, type MetaFunction, redirect } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { IconArrowUp, IconBrandReact } from '@tabler/icons-react'
import * as yup from 'yup'
import { getUserSession } from '~/handlers'
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

type ConversationType = Conversation & {
	messages: Message[]
}

export const meta: MetaFunction = () => {
	return [
		{ title: 'Chat - Remix workshop' },
	]
}

export async function loader({ request, params }: LoaderFunctionArgs) {
	const { user } = await getUserSession(request)

	let conversation: ConversationType | null = null

	if (params.id) {
		conversation = await prisma.conversation.findFirst({
			where: { id: params.id, userId: user.id },
			include: {
				messages: {
					orderBy: {
						createdAt: 'desc',
					},
				},
			},
		})
	}

	return { conversation }
}

export async function action({ request }: ActionFunctionArgs) {
	try {
		const { user } = await getUserSession(request)

		const formData = await request.formData()
		const intent = formData.get('intent')

		if (intent === 'create-conversation') {
			const data = await yupAction(formData, createConversationSchema)

			const conversation = await prisma.conversation.create({
				data: {
					userId: user.id,
					messages: {
						create: {
							content: data.content,
							sender: 'USR',
						},
					},
				},
			})

			return redirect(`/c/${conversation.id}`)
		}

		return json({ message: 'Action is not valid' }, { status: 400 })
	} catch (error) {
		return json(error, { status: 400 })
	}
}

export default function ChatRoute() {
	const data = useLoaderData<typeof loader>()

	const fetcher = useFetcher()

	const isConversationEmpty = !data.conversation

	function handleSubmitMessage(content: string) {
		fetcher.submit(
			{ intent: 'create-conversation', content },
			{ method: 'POST' },
		)
	}

	return (
		<div
			className="flex flex-col"
			style={{
				margin: 'calc(-1 * var(--app-shell-padding, 0rem))',
				height: 'calc(100vh - var(--app-shell-header-offset, 0rem))',
			}}
		>
			{!data.conversation
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
						<div className="flex flex-col gap-4 grow">
							{data.conversation.messages.map((message) => {
								if (message.sender === 'USR') {
									return (
										<Container size="sm" className="w-full" key={message.id}>
											<div className="bg-dark-6 w-fit max-w-[70%] rounded-3xl px-5 py-2.5 text-white whitespace-pre-wrap ml-auto">
												{message.content}
											</div>
										</Container>
									)
								}

								return null
							})}
						</div>
					</ScrollArea>
				)}

			<Container className="w-full mt-auto" size="sm">
				<ChatInput handleSubmit={handleSubmitMessage} />

				<Text className="text-xs text-center" px="md" py="8px">
					Chat can make mistakes. Check important info.
				</Text>
			</Container>
		</div>
	)
}

type ChatInputProps = {
	handleSubmit: (value: string) => void
}

function ChatInput({ handleSubmit }: ChatInputProps) {
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
			handleSubmit(state.value)
			setState({ value: '' })
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
			variant="filled"
			radius="26px"
			size="md"
			placeholder="Message Chat"
			minRows={1}
			maxRows={8}
			value={state.value}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
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
				>
					<IconArrowUp />
				</ActionIcon>
			}
		/>
	)
}
