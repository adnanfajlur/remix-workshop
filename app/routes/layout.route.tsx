import { ActionIcon, AppShell, Burger, Button, Group, Menu, ScrollArea, Skeleton, Text, Title, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { IconChevronRight, IconDots, IconEdit, IconLayoutSidebar } from '@tabler/icons-react'
import { getUserSession } from '~/handlers'
import { ChatMenu } from './chat-menu'

export async function loader({ request, context }: LoaderFunctionArgs) {
	const { user } = await getUserSession(request)

	return {
		user,
	}
}

const chats = [
	'Understanding the Basics of Machine Learning',
	'10 Tips for Healthy Eating',
	"A Beginner's Guide to Gardening",
	'The Importance of Regular Exercise',
	'How to Save Money on Grocery Shopping',
	'The Benefits of Mindfulness Meditation',
	'Top 5 Books Every Entrepreneur Should Read',
	'How to Create a Successful Morning Routine',
	'Exploring the Wonders of the Ocean',
	'The Art of Effective Communication',
	'A Brief History of the Internet',
	'How to Start a Successful Blog',
	'The Benefits of Volunteering in Your Community',
	'Understanding Climate Change: What You Can Do',
	'The Basics of Personal Finance Management',
	'How to Improve Your Sleep Quality',
	'The Science Behind Happiness',
	'Tips for Traveling on a Budget',
	'The Importance of Mental Health Awareness',
	'How to Build Resilience in Difficult Times',
	'The Power of Positive Thinking',
	'How to Declutter Your Home',
	'Introduction to Basic Cooking Techniques',
	'The Role of Technology in Education',
	'Simple Ways to Reduce Stress',
	'How to Develop a Growth Mindset',
	'The Benefits of Reading for Pleasure',
	'Understanding Different Types of Diets',
	'How to Foster Creativity in Your Life',
	'A Guide to Sustainable Living',
	'Tips for Networking Effectively',
	'How to Balance Work and Life',
	'The Basics of Photography for Beginners',
	'How to Set and Achieve Personal Goals',
	'The Importance of Lifelong Learning',
	'How to Create a Budget That Works',
	'Exploring Different Art Forms',
	'The Benefits of Practicing Gratitude',
	'How to Choose the Right Pet for Your Family',
	'The Impact of Social Media on Society',
	'A Guide to Effective Time Management',
	'Understanding Nutrition Labels',
	'How to Plan a Successful Event',
	'Exploring Local History: What You Need to Know',
	'The Benefits of Learning a New Language',
	'How to Stay Motivated During a Workout',
	'Tips for Building Strong Relationships',
	'The Importance of Clean Water Access',
	'How to Improve Your Public Speaking Skills',
	"A Beginner's Guide to Meditation",
	'The Role of Music in Mental Health',
	'How to Make Eco-friendly Choices',
	'The Benefits of Teamwork in the Workplace',
]

export default function LayoutRoute() {
	const { user } = useLoaderData<typeof loader>()

	const [opened, { toggle }] = useDisclosure()

	return (
		<AppShell
			layout="alt"
			header={{ height: 60 }}
			navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
			padding="md"
		>
			<AppShell.Header withBorder={false}>
				<Group h="100%" px="md">
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
					<Title order={2}>Chat</Title>
				</Group>
			</AppShell.Header>
			<AppShell.Navbar p="md" bg="dark.8" withBorder={false}>
				{
					/* <Group>
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
				</Group> */
				}
				<div className="flex flex-col gap-1">
					<Tooltip label="Close sidebar">
						<ActionIcon color="dark.8" size="xl" p="4px">
							<IconLayoutSidebar />
						</ActionIcon>
					</Tooltip>
					<Button
						fullWidth
						justify="flex-start"
						px="xs"
						size="md"
						color="dark.8"
						leftSection={<IconEdit size={22} />}
					>
						New chat
					</Button>
				</div>
				<ScrollArea
					offsetScrollbars
					className="mt-6 mr-[-12px]"
					scrollbars="y"
					classNames={{ viewport: '[&>div]:!block' }}
				>
					<div className="flex flex-col">
						{chats.map((chat) => <ChatMenu chatId={chat} title={chat} key={chat} />)}
					</div>
				</ScrollArea>
			</AppShell.Navbar>
			<AppShell.Main p="md">
				<Outlet />
			</AppShell.Main>
		</AppShell>
	)
}
