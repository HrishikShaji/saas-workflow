

import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, File, GlobeIcon, LucideProps } from "lucide-react";


export const TextTemplateFillingTask = {
	type: TaskType.TEXT_TEMPLATE_FILLING,
	label: "Text Template Filling",
	icon: (props: LucideProps) => (
		<File className="stroke-pink-500" {...props} />
	),
	isEntryPoint: true,
	inputs: [
		{
			name: "template",
			type: TaskParamType.STRING,
			helperText: "Template",
			required: true,
			hideHandle: true
		},
		{
			name: "instructions",
			type: TaskParamType.STRING,
			helperText: "instructions to be added",
			required: true,
			hideHandle: true,
		},
		{
			name: "examples",
			type: TaskParamType.STRING,
			helperText: "JSON string",
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
