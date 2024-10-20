import { json, LoaderFunctionArgs } from '@remix-run/node'
import dayjs from 'dayjs'

export async function loader({ request }: LoaderFunctionArgs) {
	const env = process.env.NODE_ENV

	const time = dayjs().format('DD/MM/YYYY HH:mm:ss')

	return json({
		message: 'OK',
		env: env,
		time: time,
	})
}
