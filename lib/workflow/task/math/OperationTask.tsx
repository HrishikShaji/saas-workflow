import { nodeSettings } from "@/lib/constants";
import { SettingsParamType } from "@/types/settings";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, GlobeIcon, LucideProps } from "lucide-react";

export const OperationTask = {
	type: TaskType.OPERATION,
	label: "Operation",
	icon: (props: LucideProps) => (
		<Bot className="stroke-pink-500" {...props} />
	),
	isEntryPoint: false,
	inputs: [
		{
			name: "variableOne",
			type: TaskParamType.NUMBER,
			helperText: "Variable One",
			required: true,
			hideHandle: false
		},
		{
			name: "variableTwo",
			type: TaskParamType.NUMBER,
			helperText: "VariableTwo",
			required: true,
			hideHandle: false
		}

	] as const,
	outputs: [
		{ name: "Response", type: TaskParamType.NUMBER }
	] as const,
	settings: nodeSettings,
	credits: 5
} satisfies WorkflowTask
