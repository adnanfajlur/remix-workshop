import { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
	throw new Error('Something went wrong')
}

export default function ServerErrorRoute() {
	return <div>Server Error</div>
}
