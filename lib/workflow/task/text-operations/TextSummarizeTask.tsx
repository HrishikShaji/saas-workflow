import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, File, GlobeIcon, LucideProps } from "lucide-react";


export const TextSummarizeTask = {
	type: TaskType.TEXT_SUMMARIZE,
	label: "Text Summarize",
	icon: (props: LucideProps) => (
		<File className="stroke-pink-500" {...props} />
	),
	isEntryPoint: true,
	inputs: [
		{
			name: "input",
			type: TaskParamType.STRING,
			helperText: "Text to examine",
			required: true,
			hideHandle: true
		},
		{
			name: "mode",
			type: TaskParamType.STRING,
			helperText: "abstractive or extractive",
			required: true,
			hideHandle: true,
		},

	] as const,
	outputs: [
		{ name: "AI Response", type: TaskParamType.AI_RESPONSE }
	] as const,
	settings: nodeSettings,
	credits: 5
} satisfies WorkflowTask
