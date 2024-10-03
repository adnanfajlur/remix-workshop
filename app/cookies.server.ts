import { createCookie } from '@remix-run/node'
import { lucia } from './libs/lucia.server'

export const githubAuthCookie = createCookie('github-oauth-state', {
	path: '/',
	secure: process.env.NODE_ENV === 'production',
	httpOnly: true,
	maxAge: 60 * 10,
	sameSite: 'strict',
})
