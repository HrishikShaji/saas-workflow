import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, File, GlobeIcon, LucideProps } from "lucide-react";


export const TextElaboratorTask = {
	type: TaskType.TEXT_ELABORATOR,
	label: "Text Elaborator",
	icon: (props: LucideProps) => (
		<File className="stroke-pink-500" {...props} />
	),
	isEntryPoint: false,
	inputs: [
		{
			name: "input",
			type: TaskParamType.AI_RESPONSE,
			helperText: "Text to examine",
			required: true,
			hideHandle: false
		},
		{
			name: "level",
			type: TaskParamType.NUMBER,
			helperText: "1-5",
			required: true,
			hideHandle: true,
		},

		{
			name: "style",
			type: TaskParamType.STRING,
			helperText: "academic creative journalistic technical",
			required: true,
			hideHandle: true,
		},
		{
			name: "targetLength",
			type: TaskParamType.STRING,
			helperText: "short medium long xlong",
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
