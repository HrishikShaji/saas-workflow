import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, CodeIcon, GlobeIcon, LucideProps } from "lucide-react";

export const PolisherAgentTask = {
	type: TaskType.POLISHER_AGENT,
	label: "Polisher Agent",
	icon: (props: LucideProps) => (
		<Bot className="stroke-rose-400" {...props} />
	),
	isEntryPoint: false,
	inputs: [
		{
			name: "content",
			type: TaskParamType.AI_RESPONSE,
			required: true,
		}
	] as const,
	outputs: [
		{
			name: "AI Response",
			type: TaskParamType.AI_RESPONSE
		}
	] as const,
	settings: nodeSettings,
	credits: 2
} satisfies WorkflowTask
