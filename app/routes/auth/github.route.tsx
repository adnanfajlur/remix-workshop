import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { OAuth2RequestError } from 'arctic'
import { UserId } from 'lucia'
import * as yup from 'yup'
import { githubAuthCookie } from '~/cookies.server'
import { githubArctic, lucia } from '~/libs/lucia.server'
import { prisma } from '~/libs/prisma.server'
import { yupAction } from '~/utils/yup-action'

const searchSchema = yup.object({
	code: yup.string().required(),
	state: yup.string().required(),
})

export async function loader({ request }: LoaderFunctionArgs) {
	const data = await yupAction(request, searchSchema, 'search-params')

	const cookieHeader = request.headers.get('Cookie')
	const stateCookie = await githubAuthCookie.parse(cookieHeader)

	if (!stateCookie || stateCookie !== data.state) {
		return json({ message: 'Invalid' }, { status: 400 })
	}

	async function createSession(userId: UserId) {
		const session = await lucia.createSession(userId, { createdAt: new Date() })
		const sessionCookie = lucia.createSessionCookie(session.id)

		return redirect('/', {
			headers: {
				'Set-Cookie': sessionCookie.serialize(),
			},
		})
	}

	try {
		const token = await githubArctic.validateAuthorizationCode(data.code)
		const githubUser: GitHubUserRes = await fetch(
			`https://api.github.com/user`,
			{
				headers: { Authorization: `Bearer ${token.accessToken}` },
			},
		).then((resp) => resp.json())

		const existingAuthUser = await prisma.authProvider.findFirst({
			where: {
				providerId: 'github',
				providerUserId: githubUser.id.toString(),
			},
		})

		if (existingAuthUser) {
			return createSession(existingAuthUser.userId)
		}

		const existingUserWithSameEmail = await prisma.user.findFirst({
			where: { email: githubUser.email },
		})

		if (existingUserWithSameEmail) {
			await prisma.authProvider.create({
				data: {
					providerId: 'github',
					providerUserId: githubUser.id.toString(),
					userId: existingUserWithSameEmail.id,
				},
			})

			return createSession(existingUserWithSameEmail.id)
		}

		const newUser = await prisma.user.create({
			data: {
				name: githubUser.name,
				email: githubUser.email,
				authProviders: {
					create: { providerId: 'github', providerUserId: githubUser.id.toString() },
				},
			},
		})

		return createSession(newUser.id)
	} catch (error) {
		if (error instanceof OAuth2RequestError) {
			return json({ message: error.message }, { status: 400 })
		}

		return json({ message: error.message }, { status: 500 })
	}
}

type GitHubUserRes = {
	id: number
	login: string // username
	name: string
	email: string
}
