import { Button, Paper, Text, Title } from '@mantine/core'
import { type ActionFunctionArgs, createCookie, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { Form, json, Link, redirect, useActionData, useFetcher, useLoaderData } from '@remix-run/react'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import { generateCodeVerifier, generateState } from 'arctic'
import { draw, sleep } from 'radash'
import * as yup from 'yup'
import { appEnv } from '~/configs/app-env'
import { serverEnv } from '~/configs/server-env.server'
import { githubAuthCookie, googleAuthCodeVerifierCookie, googleAuthStateCookie } from '~/cookies.server'
import { githubArctic, googleArctic } from '~/libs/lucia.server'
import { yupAction } from '~/utils/yup-action'

const authSchema = yup.object({
	provider: yup.string().oneOf(['google', 'github'], 'Invalid provider').required(),
})

export async function loader({ request }: LoaderFunctionArgs) {
	const hasGoogleProvider = Boolean(serverEnv.GOOGLE_CLIENT_ID && serverEnv.GOOGLE_CLIENT_SECRET)
	const hasGithubProvider = Boolean(serverEnv.GITHUB_CLIENT_ID && serverEnv.GITHUB_CLIENT_SECRET)

	return {
		providers: {
			google: hasGoogleProvider,
			github: hasGithubProvider,
		},
	}
}

export async function action({ request }: ActionFunctionArgs) {
	try {
		const data = await yupAction(request, authSchema, 'form-data')

		if (data.provider === 'github') {
			const state = generateState()

			const url = await githubArctic.createAuthorizationURL(state)

			return redirect(
				url.toString(),
				{
					headers: { 'Set-Cookie': await githubAuthCookie.serialize(state) },
				},
			)
		}

		if (data.provider === 'google') {
			const state = generateState()
			const codeVerifier = generateCodeVerifier()

			const url = await googleArctic.createAuthorizationURL(state, codeVerifier, {
				scopes: ['openid', 'profile', 'email'],
			})

			const headers = new Headers()
			headers.append('Set-Cookie', await googleAuthStateCookie.serialize(state))
			headers.append('Set-Cookie', await googleAuthCodeVerifierCookie.serialize(codeVerifier))

			return redirect(url.toString(), { headers })
		}

		return json(data)
	} catch (error) {
		return json(error, { status: 400 })
	}
}

export const meta: MetaFunction = () => {
	return [
		{ title: 'Auth - Remix workshop' },
	]
}

export default function AuthRoute() {
	const fetcher = useFetcher()
	const data = useLoaderData<typeof loader>()

	return (
		<div className="h-full flex items-center justify-center p-8 pt-36">
			<Paper withBorder p="lg" radius="md" className="w-full max-w-[380px]">
				<Title order={2} className="text-balance">Welcome to Remix workshop!</Title>
				<p className="text-gray-6 font-medium mb-1 mt-2">Login with</p>

				<fetcher.Form method="POST">
					<fieldset className="mx-auto mt-6 flex flex-col gap-3" disabled={fetcher.state !== 'idle'}>
						{data.providers.google && (
							<Button
								variant="default"
								radius="xl"
								leftSection={<IconBrandGoogle />}
								type="submit"
								name="provider"
								value="google"
							>
								Google
							</Button>
						)}

						{data.providers.github && (
							<Button
								variant="default"
								radius="xl"
								leftSection={<IconBrandGithub />}
								type="submit"
								name="provider"
								value="github"
							>
								Github
							</Button>
						)}
					</fieldset>
				</fetcher.Form>
			</Paper>
		</div>
	)
}
