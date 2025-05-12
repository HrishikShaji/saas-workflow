import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, File, GlobeIcon, LucideProps } from "lucide-react";


export const TextCodeGenerationTask = {
	type: TaskType.TEXT_CODE_GENERATION,
	label: "Code Generation",
	icon: (props: LucideProps) => (
		<File className="stroke-pink-500" {...props} />
	),
	isEntryPoint: true,
	inputs: [
		{
			name: "task",
			type: TaskParamType.STRING,
			helperText: "task to do",
			required: true,
			hideHandle: true
		},
		{
			name: "language",
			type: TaskParamType.STRING,
			helperText: "python javascript",
			required: true,
			hideHandle: true,
		},
		{
			name: "requirements",
			type: TaskParamType.STRING,
			helperText: "array",
			required: true,
			hideHandle: true
		},
		{
			name: "examples",
			type: TaskParamType.STRING,
			helperText: "array",
			required: true,
			hideHandle: true
		},
		{
			name: "styleGuide",
			type: TaskParamType.STRING,
			helperText: "string",
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
