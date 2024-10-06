import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Google, OAuth2RequestError } from 'arctic'
import { UserId } from 'lucia'
import * as yup from 'yup'
import { googleAuthCodeVerifierCookie, googleAuthStateCookie } from '~/cookies.server'
import { googleArctic, lucia } from '~/libs/lucia.server'
import { prisma } from '~/libs/prisma.server'
import { yupAction } from '~/utils/yup-action'

const searchSchema = yup.object({
	code: yup.string().required(),
	state: yup.string().required(),
})

export async function loader({ request }: LoaderFunctionArgs) {
	const searchParams = await yupAction(request, searchSchema, 'search-params')

	const cookieHeader = request.headers.get('Cookie')

	const stateCookie = await googleAuthStateCookie.parse(cookieHeader)
	const codeVerifierCookie = await googleAuthCodeVerifierCookie.parse(cookieHeader)

	if (!stateCookie || !codeVerifierCookie || searchParams.state !== stateCookie) {
		return json({ message: 'Invalid' }, { status: 400 })
	}

	async function createSession(userId: UserId) {
		const session = await lucia.createSession(userId, { createdAt: new Date() })
		const sessionCookie = lucia.createSessionCookie(session.id)

		return redirect('/', {
			headers: { 'Set-Cookie': sessionCookie.serialize() },
		})
	}

	try {
		const tokens = await googleArctic.validateAuthorizationCode(searchParams.code, codeVerifierCookie)

		const googleUser: GoogleUserRes = await fetch(
			`https://openidconnect.googleapis.com/v1/userinfo`,
			{ headers: { Authorization: `Bearer ${tokens.accessToken}` } },
		).then((resp) => resp.json())

		const existingAuthUser = await prisma.authProvider.findFirst({
			where: {
				providerId: 'google',
				providerUserId: googleUser.sub,
			},
		})

		if (existingAuthUser) {
			return createSession(existingAuthUser.userId)
		}

		const existingUserWithSameEmail = await prisma.user.findFirst({
			where: { email: googleUser.email },
		})

		if (existingUserWithSameEmail) {
			await prisma.authProvider.create({
				data: {
					providerId: 'google',
					providerUserId: googleUser.sub,
					userId: existingUserWithSameEmail.id,
				},
			})

			return createSession(existingUserWithSameEmail.id)
		}

		const newUser = await prisma.user.create({
			data: {
				name: googleUser.name,
				email: googleUser.email,
				authProviders: {
					create: { providerId: 'google', providerUserId: googleUser.sub },
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

type GoogleUserRes = {
	sub: string
	name: string
	given_name: string
	family_name: string
	picture: string
	email: string
	email_verified: boolean
}
