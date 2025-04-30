
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, GlobeIcon, LucideProps } from "lucide-react";

export const ClarityAgentTask = {
	type: TaskType.CLARITY_AGENT,
	label: "Get Clarity",
	icon: (props: LucideProps) => (
		<CodeIcon className="stroke-rose-400" {...props} />
	),
	isEntryPoint: false,
	inputs: [
		{
			name: "AI Generated Content",
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
	credits: 2
} satisfies WorkflowTask
