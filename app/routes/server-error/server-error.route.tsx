import { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
	throw new Error('This is a test error')
}

export default function ServerErrorRoute() {
	return <div>Server Error</div>
}
