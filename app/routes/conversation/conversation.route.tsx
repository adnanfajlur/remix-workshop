import { ActionIcon, Card, Container, ScrollArea, Text, Textarea } from '@mantine/core'
import { useMounted } from '@mantine/hooks'
import type { MetaFunction } from '@remix-run/node'
import { IconArrowUp, IconBrandReact, IconCircleArrowUp } from '@tabler/icons-react'
import classes from './conversation.route.module.css'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Chat - Remix workshop' },
	]
}

const CONVERSATION_SUGGESTIONS = [
	'Create a workout plan',
	'Python script for daily email reports',
	'Write a report based on my data',
	'Summarize a long document',
]

export default function ChatRoute() {
	const isMounted = useMounted()

	const isConversationEmpty = true

	return (
		<div
			className="flex flex-col"
			style={{
				margin: 'calc(-1 * var(--app-shell-padding, 0rem))',
				height: 'calc(100vh - var(--app-shell-header-offset, 0rem))',
			}}
		>
			{isConversationEmpty
				? (
					<Container size="sm" className="w-full grow flex flex-col items-center justify-center">
						<IconBrandReact size={52} stroke={1.4} />
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
							{CONVERSATION_SUGGESTIONS.map((suggestion) => (
								<Card
									key={suggestion}
									withBorder
									component="button"
									radius="12px"
									className="text-left bg-transparent hover:bg-dark-6 text-[15px]"
								>
									<span className="line-clamp-3 text-balance">{suggestion}</span>
								</Card>
							))}
						</div>
					</Container>
				)
				: (
					<ScrollArea scrollbars="y">
						<div className="flex flex-col gap-4 grow">
							<Container size="sm" className="w-full bg-red-5">
								<Text>Conversation section 1</Text>
							</Container>
						</div>
					</ScrollArea>
				)}

			<Container className="w-full mt-auto" size="sm">
				{
					// Textarea issue: causing cls on hydration process
					// https://github.com/mantinedev/mantine/issues/6719#issuecomment-2309326434
				}

				{isMounted
					? (
						<Textarea
							autosize
							variant="filled"
							radius="26px"
							size="md"
							placeholder="Message Chat"
							minRows={1}
							maxRows={8}
							classNames={{
								input: '!border-none pl-[24px] pr-[46px] py-[13px] placeholder:text-dark-1 text-white',
								section: 'end-[6px]',
							}}
							rightSection={
								<ActionIcon
									variant="white"
									radius="100%"
									size="32px"
									classNames={{ root: classes['send-button'] }}
									disabled
								>
									<IconArrowUp />
								</ActionIcon>
							}
						/>
					)
					: <div className="h-[51px]" />}

				<Text className="text-xs text-center" px="md" py="8px">
					Chat can make mistakes. Check important info.
				</Text>
			</Container>
		</div>
	)
}
