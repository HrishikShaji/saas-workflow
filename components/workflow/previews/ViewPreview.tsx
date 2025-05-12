import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import styles from "../../../styles/document.module.css"
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

interface Props {
	outputs: string;
	setPreview: Dispatch<SetStateAction<boolean>>;
}

export default function ViewPreview({ outputs, setPreview }: Props) {
	const parsedOutputs = JSON.parse(outputs)
	const outputsArr = Object.entries(parsedOutputs)
	const finalOutput = outputsArr[outputsArr.length - 1] as any
	console.log("@@OUTPUT", parsedOutputs)
	console.log("@@FINALOUTPUT", finalOutput)
	return (
		<div className="w-full h-[calc(100vh_-_110px)]">
			<div className="w-full px-10">
				<Button className=" bg-green-500 hover:bg-green-600" onClick={() => setPreview(false)}>View Run</Button>
			</div>
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
