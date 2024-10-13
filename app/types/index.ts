import { Conversation, Message } from '@prisma/client'

export type ConversationType = Pick<Conversation, 'id' | 'title' | 'updatedAt'>

export type MessageType = Pick<Message, 'id' | 'content' | 'sender' | 'createdAt'>

export type ConversationWithMessagesType = ConversationType & {
	messages: MessageType[]
}
