import { Menu, Tooltip } from '@mantine/core'
import { IconDots } from '@tabler/icons-react'
import { cn } from '~/utils/cn'

type ChatMenuProps = Omit<React.ComponentProps<'div'>, 'children'> & {
	chatId: string
	title: string
}

export function ChatMenu({ chatId, title, className, ...props }: ChatMenuProps) {
	return (
		<div
			{...props}
			className={cn(
				'group relative rounded-lg hover:bg-dark-5 cursor-pointer text-sm text-white',
				className,
			)}
		>
			<div className="flex items-center gap-2 px-[11px] py-2">
				<div className="relative grow overflow-hidden whitespace-nowrap">
					{title}
					<div className="absolute bottom-0 top-0 right-0 to-transparent bg-gradient-to-l from-dark-8 from-0% w-8 group-hover:from-60% group-hover:w-10 group-hover:from-dark-5" />
				</div>
			</div>
			<Menu trigger="click" shadow="md">
				<Menu.Target>
					<div className="absolute bottom-0 top-0 right-0 items-center gap-1.5 pr-2 hidden group-hover:flex">
						<div className="flex items-center justify-center transition">
							<IconDots size={20} strokeWidth={1.4} />
						</div>
					</div>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Item>Share</Menu.Item>
					<Menu.Item>Rename</Menu.Item>
					<Menu.Item>Delete</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</div>
	)
}
