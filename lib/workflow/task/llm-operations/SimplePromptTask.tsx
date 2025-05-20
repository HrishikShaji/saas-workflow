import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, GlobeIcon, LucideProps } from "lucide-react";

export const SimplePromptTask = {
	type: TaskType.SIMPLE_PROMPT,
	label: "Simple Prompt",
	icon: (props: LucideProps) => (
		<Bot className="stroke-pink-500" {...props} />
	),
	isEntryPoint: true,
	inputs: [
		{
			name: "prompt",
			type: TaskParamType.STRING,
			helperText: "Legal compliance",
			required: true,
			hideHandle: true
		},

	] as const,
	outputs: [
		{ name: "Response", type: TaskParamType.STRING }
	] as const,
	settings: nodeSettings,
	credits: 5
} satisfies WorkflowTask
