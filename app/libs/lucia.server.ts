import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { GitHub } from 'arctic'
import { Lucia } from 'lucia'
import { serverEnv } from '~/configs/server-env.server'
import { prisma } from './prisma.server'

// const adapter = new BetterSQLite3Adapter(db); // your adapter
const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === 'production',
		},
	},
	getUserAttributes(user) {
		return {
			name: user.name,
			email: user.email,
		}
	},
})

export const githubArctic = new GitHub(
	serverEnv.GITHUB_CLIENT_ID,
	serverEnv.GITHUB_CLIENT_SECRET,
)

// IMPORTANT!
declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: {
			name: string
			email: string
		}
		DatabaseSessionAttributes: {}
	}
}
