import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, File, GlobeIcon, LucideProps } from "lucide-react";


export const TextFormatConverterTask = {
	type: TaskType.TEXT_FORMAT_CONVERTER,
	label: "Text Format Converter",
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
			name: "format",
			type: TaskParamType.STRING,
			helperText: "txt json xml csv",
			required: true,
			hideHandle: true,
		},
		{
			name: "sourceFormat",
			type: TaskParamType.STRING,
			helperText: "txt auto json csv xml",
			required: true,
			hideHandle: true
		},
		{
			name: "prettyPrint",
			type: TaskParamType.STRING,
			helperText: "true or false",
			required: true,
			hideHandle: true,
		},
		{
			name: "strictMode",
			type: TaskParamType.STRING,
			helperText: "true or false",
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
