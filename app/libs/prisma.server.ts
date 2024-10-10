import { PrismaClient } from '@prisma/client'

function singleton<Value>(name: string, value: () => Value): Value {
	const globalStore = global as any

	globalStore.__singletons ??= {}
	globalStore.__singletons[name] ??= value()

	return globalStore.__singletons[name]
}

const prisma = singleton('prisma', () => {
	return new PrismaClient({
		omit: {
			conversation: {
				deletedAt: true,
				userId: true,
			},
			message: {
				conversationId: true,
			},
			todo: {
				deletedAt: true,
				userId: true,
			},
		},
	})
})

prisma.$connect()

export { prisma }
