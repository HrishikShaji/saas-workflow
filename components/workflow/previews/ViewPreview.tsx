import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import styles from "../../../styles/document.module.css"

interface Props {
	outputs: string;
}

export default function ViewPreview({ outputs }: Props) {
	const parsedOutputs = JSON.parse(outputs)
	const outputsArr = Object.entries(parsedOutputs)
	const finalOutput = outputsArr[outputsArr.length - 1] as any
	console.log("@@OUTPUT", parsedOutputs)
	console.log("@@FINALOUTPUT", finalOutput)
	return (
		<div className="w-full h-[calc(100vh_-_110px)]">
			<div className="w-full h-full flex justify-center items-center overflow-y-auto">

				<div className="w-[800px] py-20 h-full">
					<div className={styles.markdown}>
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							rehypePlugins={[rehypeRaw]}
						>
							{finalOutput[1]}
						</ReactMarkdown>
					</div>

				</div>
			</div>
		</div>

	)
}
