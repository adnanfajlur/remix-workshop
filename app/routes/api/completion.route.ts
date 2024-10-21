import { Conversation, Message, Prisma } from '@prisma/client'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { ChatCompletionChunk, ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { getUserSession } from '~/handlers'
import { logger } from '~/libs/logger.server'
import { openai } from '~/libs/openai.server'
import { prisma } from '~/libs/prisma.server'

type ConversationType = Conversation & { messages: Pick<Message, 'id' | 'content' | 'sender'>[] }

const conversationInclude: Prisma.ConversationInclude = {
	messages: {
		orderBy: { createdAt: 'desc' },
		select: { id: true, content: true, sender: true },
	},
}

export async function action({ request, params }: ActionFunctionArgs) {
	const { user } = await getUserSession(request)

	const formData = await request.formData()
	const conversationId = formData.get('id') as string
	const content = formData.get('content') as string

	const isNewConversation = !conversationId

	let conversation: ConversationType | null = null

	if (isNewConversation) {
		conversation = await prisma.conversation.create({
			data: { title: 'New chat', userId: user.id },
			include: conversationInclude,
		})
	} else {
		conversation = await prisma.conversation.findFirst({
			where: { id: conversationId, userId: user.id, deletedAt: null },
			include: conversationInclude,
		})
	}

	if (!conversation) {
		return json({ message: 'Conversation is not found' }, { status: 404 })
	}

	return new Response(new ReadableStream({
		async start(controller) {
			function enqueue(event: string, data: any) {
				controller.enqueue(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
			}

			try {
				if (isNewConversation) {
					enqueue('new-conversation', { conversation })
				}

				const userMessage = await prisma.message.create({
					data: { content, sender: 'user', conversationId: conversation.id },
				})

				enqueue('user-msg', { message: userMessage })

				const messages: { role: string; content: string }[] = [
					{
						role: 'system',
						content: `You are a helpful assistant. Always respond using Markdown formatting like chatgpt does. Use language from the conversation or source. Current date: ${
							new Date().toLocaleDateString()
						}`,
					},
					...conversation.messages.map((msg) => ({ role: msg.sender, content: msg.content })),
					{ role: 'user', content },
				]

				const stream = openai.beta.chat.completions.stream({
					model: 'gpt-4o-mini',
					messages: messages as ChatCompletionMessageParam[],
					user: user.id,
				})

				stream.on('content', (content) => {
					enqueue('msg', { content })
				})

				const chatCompletion = await stream.finalChatCompletion()
				const fullResponse = chatCompletion.choices[0]?.message?.content || ''

				let newTitle = ''

				if (isNewConversation) {
					const generatedTitle = await openai.chat.completions.create({
						model: 'gpt-4o-mini',
						messages: [
							...messages as ChatCompletionMessageParam[],
							{ role: 'assistant', content: fullResponse },
							{ role: 'system', content: `Please give me a title for this conversation, like chatgpt does, without any symbol` },
						],
					})

					newTitle = generatedTitle.choices[0]?.message.content?.trim() || conversation.title
				}

				const conversationUpdateData: Prisma.ConversationUpdateInput = { updatedAt: new Date() }

				if (isNewConversation) {
					conversationUpdateData.title = newTitle
				}

				const [assistantMessage] = await Promise.all([
					prisma.message.create({
						data: {
							content: fullResponse,
							sender: 'assistant',
							conversationId: conversation.id,
						},
					}),
					prisma.conversation.update({
						where: { id: conversation.id, userId: user.id, deletedAt: null },
						data: conversationUpdateData,
					}),
				])

				enqueue('assistant-msg', { message: assistantMessage })
			} catch (error) {
				logger.error({
					code: 'ERROR_OPENAI_STREAM',
					error,
				})
				enqueue('error', { message: 'An error occured' })
			} finally {
				controller.close()
			}
		},

		cancel() {
			// handle cancellation
		},
	}), {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
		},
	})
}
