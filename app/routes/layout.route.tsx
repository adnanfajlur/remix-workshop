import { Button } from '@mantine/core'
import type { MetaFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

export default function LayoutRoute() {
	return (
		<div>
			<p>Layout</p>
			<Outlet />
		</div>
	)
}
