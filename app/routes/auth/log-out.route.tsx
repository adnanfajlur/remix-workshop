import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { getUserSession } from '~/handlers'
import { lucia } from '~/libs/lucia.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const { user, session } = await getUserSession(request)

	await lucia.invalidateSession(session.id)

	const sessionCookie = lucia.createBlankSessionCookie()

	return redirect('/auth', {
		headers: {
			'Set-Cookie': sessionCookie.serialize(),
		},
	})
}
