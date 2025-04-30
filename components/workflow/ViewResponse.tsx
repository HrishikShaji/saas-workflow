import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import styles from "../../styles/document.module.css"

interface Props {
	response: string;
	type: "input" | "output";
}

export default function ViewResponse({ response, type }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">{`View ${type}`}</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[625px]">
				<DialogHeader>
					<DialogTitle>{type}</DialogTitle>
				</DialogHeader>
				<div className="py-4 pr-5 max-h-[500px] overflow-y-auto">
					<div className={styles.markdown}>
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							rehypePlugins={[rehypeRaw]}
						>
							{response}
						</ReactMarkdown>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
