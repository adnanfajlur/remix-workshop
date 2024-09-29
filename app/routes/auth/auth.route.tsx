import { Button, Paper, Text, Title } from '@mantine/core'
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Form, json, Link, useActionData, useFetcher } from '@remix-run/react'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import * as yup from 'yup'
import { yupAction } from '~/utils/yup-action'

export async function loader({ request }: LoaderFunctionArgs) {
	throw new Error('Something wrong, the error from loader')
	return null
}

const authSchema = yup.object({
	provider: yup.string().oneOf(['google', 'github'], 'Invalid provider').required(),
})

export async function action({ request }: ActionFunctionArgs) {
	throw new Error('Something wrong')
	try {
		const data = await yupAction(request, authSchema)

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
	const actionData = useActionData()
	console.log('logdev', actionData)

	return (
		<div className="h-full flex items-center justify-center p-8 pt-36">
			<Paper withBorder p="lg" radius="md" className="w-full max-w-[380px]">
				<Title order={2} className="text-balance">Welcome to Remix workshop!</Title>
				<p className="text-gray-6 font-medium">Login with</p>

				<Form method="POST" className="mx-auto mt-6 flex flex-col gap-2">
					<Button
						variant="default"
						radius="xl"
						leftSection={<IconBrandGoogle />}
						type="submit"
						name="provider"
						value="test"
					>
						Google
					</Button>
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
				</Form>
			</Paper>
		</div>
	)
}
