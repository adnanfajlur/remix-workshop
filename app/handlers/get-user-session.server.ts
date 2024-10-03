import { redirect } from '@remix-run/node'
import { lucia } from '~/libs/lucia.server'

export async function getUserSession(request: Request) {
	const sessionId = lucia.readSessionCookie(request.headers.get('Cookie') || '')
	if (!sessionId) throw redirect('/auth')

	const user = await lucia.validateSession(sessionId)
	if (!user.session || !user.user) throw redirect('/auth')

	return {
		user: user.user,
		session: user.session,
	}
}
