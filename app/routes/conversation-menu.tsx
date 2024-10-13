import { Box, BoxComponentProps, Loader, Menu } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import { Link, useParams } from '@remix-run/react'
import { IconDots, IconEdit, IconPencil, IconShare, IconTrash, IconUpload } from '@tabler/icons-react'
import { cn } from '~/utils/cn'

type ConversationMenuProps = Omit<BoxComponentProps, 'children'> & {
	conversationId: string
	title: string
}

export function ConversationMenu({ conversationId, title, className, ...props }: ConversationMenuProps) {
	const params = useParams()
	const activeConversationId = params['conversation-id']

	const [state, setState] = useSetState({
		isMenuOpened: false,
	})

	const isActive = conversationId === activeConversationId

	return (
		<Box
			component={Link}
			to={`/c/${conversationId}`}
			{...props}
			className={cn(
				'group relative rounded-lg hover:bg-dark-5 cursor-pointer text-sm text-white h-9',
				{ 'bg-dark-5': state.isMenuOpened || isActive },
				className,
			)}
		>
			<div className="flex items-center gap-2 px-[11px] py-2">
				<div className="relative grow overflow-hidden whitespace-nowrap flex items-center">
					{title || <Loader size="xs" type="dots" color="white" className="ml-1" />}
					<div
						className={cn('absolute bottom-0 top-0 right-0 to-transparent bg-gradient-to-l from-dark-8 from-0% w-8 group-hover:w-10 group-hover:from-60% group-hover:from-dark-5', {
							'w-10 from-60% from-dark-5': state.isMenuOpened || isActive,
						})}
					/>
				</div>
			</div>
			<Menu
				opened={state.isMenuOpened}
				onChange={(val) => setState({ isMenuOpened: val })}
				trigger="click"
				shadow="md"
				width={140}
			>
				<Menu.Target>
					<div
						className={cn('absolute bottom-0 top-0 right-0 items-center gap-1.5 pr-2 hidden group-hover:flex', { flex: state.isMenuOpened || isActive })}
						onClick={(e) => e.preventDefault()}
					>
						<div className="flex items-center justify-center transition">
							<IconDots size={20} stroke={1.4} />
						</div>
					</div>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Item leftSection={<IconUpload size={16} />}>Share</Menu.Item>
					<Menu.Item leftSection={<IconPencil size={16} />}>Rename</Menu.Item>
					<Menu.Item leftSection={<IconTrash size={16} />} color="red">Delete</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</Box>
	)
}
