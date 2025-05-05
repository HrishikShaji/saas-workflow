import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, CodeIcon, GlobeIcon, LucideProps } from "lucide-react";

export const OptionsAgentTask = {
	type: TaskType.OPTIONS_AGENT,
	label: "Get Options",
	icon: (props: LucideProps) => (
		<Bot className="stroke-rose-400" {...props} />
	),
	isEntryPoint: true,
	inputs: [
		{
			name: "System Message",
			type: TaskParamType.STRING,
			required: true,
		},
		{
			name: "Prompt",
			type: TaskParamType.STRING,
			required: true
		},
		{
			name: "No of Options",
			type: TaskParamType.NUMBER,
			required: true
		}
	] as const,
	outputs: [
		{
			name: "Options",
			type: TaskParamType.OPTIONS
		}
	] as const,
	settings: nodeSettings,
	credits: 2
} satisfies WorkflowTask
