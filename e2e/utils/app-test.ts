import { test as base } from '@playwright/test'
import { serverEnv } from '~/configs/server-env.server'
import { lucia } from '~/libs/lucia.server'

export const appTest = base.extend({
	context: async ({ context }, use) => {
		const USER_ID = serverEnv.TEST_USER_ID

		const sessions = await lucia.getUserSessions(USER_ID)
		if (sessions.length === 0) {
			const newSession = await lucia.createSession(USER_ID, { createdAt: new Date() })
			sessions.push(newSession)
		}

		const sessionCookie = lucia.createSessionCookie(sessions[0].id)

		await context.addCookies([
			{ name: sessionCookie.name, value: sessionCookie.value, domain: 'localhost', path: '/' },
		])

		await use(context)
	},
})
