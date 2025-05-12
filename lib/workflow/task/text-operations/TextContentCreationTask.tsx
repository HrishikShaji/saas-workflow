
import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, File, GlobeIcon, LucideProps } from "lucide-react";


export const TextContentCreationTask = {
	type: TaskType.TEXT_CONTENT_CREATION,
	label: "Text Content Creation",
	icon: (props: LucideProps) => (
		<File className="stroke-pink-500" {...props} />
	),
	isEntryPoint: true,
	inputs: [
		{
			name: "topic",
			type: TaskParamType.STRING,
			helperText: "Topic",
			required: true,
			hideHandle: true
		},
		{
			name: "contentType",
			type: TaskParamType.STRING,
			helperText: "article report",
			required: true,
			hideHandle: true,
		},
		{
			name: "length",
			type: TaskParamType.STRING,
			helperText: "small medium large",
			required: true,
			hideHandle: true
		},

		{
			name: "style",
			type: TaskParamType.STRING,
			helperText: "journalistic ",
			required: true,
			hideHandle: true
		},
		{
			name: "audience",
			type: TaskParamType.STRING,
			helperText: "children non-native",
			required: true,
			hideHandle: true
		},
	] as const,
	outputs: [
		{ name: "AI Response", type: TaskParamType.AI_RESPONSE }
	] as const,
	settings: nodeSettings,
	credits: 5
} satisfies WorkflowTask
