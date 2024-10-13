import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function CustomMarkdown({ children }: { children: string }) {
	return (
		<Markdown remarkPlugins={[remarkGfm]} className="prose prose-invert break-words markdown">
			{children}
		</Markdown>
	)
}
