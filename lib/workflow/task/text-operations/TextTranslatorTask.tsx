import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, File, GlobeIcon, LucideProps } from "lucide-react";


export const TextTranslatorTask = {
	type: TaskType.TEXT_TRANSLATOR,
	label: "Text Translator",
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
			name: "target language",
			type: TaskParamType.STRING,
			helperText: "malayalam",
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
