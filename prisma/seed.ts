import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
	await prisma.user.upsert({
		where: { id: '6be6b043-7e5b-4103-9238-db513603ea94' },
		create: {
			id: '6be6b043-7e5b-4103-9238-db513603ea94',
			name: 'Budi test',
			email: 'budi-test@yopmail.com',
			authProviders: {
				create: {
					providerId: 'email',
					providerUserId: 'budi-test@yopmail.com',
				},
			},
		},
		update: {},
	})

	console.log(`Database has been seeded. 🌱`)
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
