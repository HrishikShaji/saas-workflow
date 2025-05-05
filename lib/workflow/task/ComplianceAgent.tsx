import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, CodeIcon, GlobeIcon, LucideProps } from "lucide-react";

export const ComplianceAgentTask = {
	type: TaskType.COMPLIANCE_AGENT,
	label: "Check Compliance",
	icon: (props: LucideProps) => (
		<Bot className="stroke-rose-400" {...props} />
	),
	isEntryPoint: false,
	inputs: [
		{
			name: "AI Generated Content",
			type: TaskParamType.AI_RESPONSE,
			required: true,
		},
		{
			name: "Law",
			type: TaskParamType.STRING,
			required: true
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
