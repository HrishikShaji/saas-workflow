
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, GlobeIcon, LucideProps } from "lucide-react";

export const PromptGeneratorTask = {
	type: TaskType.PROMPT_GENERATOR,
	label: "Prompt Generator",
	icon: (props: LucideProps) => (
		<Bot className="stroke-pink-500" {...props} />
	),
	isEntryPoint: true,
	inputs: [
		{
			name: "input",
			type: TaskParamType.STRING,
			helperText: "Legal compliance",
			required: true,
			hideHandle: true
		},
		{
			name: "use case",
			type: TaskParamType.STRING,
			helperText: "Create a legal document",
			required: true,
			hideHandle: true
		}

	] as const,
	outputs: [
		{ name: "AI Response", type: TaskParamType.AI_RESPONSE }
	] as const,
	credits: 5
} satisfies WorkflowTask
