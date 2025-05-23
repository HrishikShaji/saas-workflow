import { nodeSettings } from "@/lib/constants";
import { SettingsParamType } from "@/types/settings";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, GlobeIcon, LucideProps } from "lucide-react";

export const VariableTask = {
	type: TaskType.VARIABLE,
	label: "Variable",
	icon: (props: LucideProps) => (
		<Bot className="stroke-pink-500" {...props} />
	),
	isEntryPoint: true,
	inputs: [
		{
			name: "variableName",
			type: TaskParamType.STRING,
			helperText: "Variable Name",
			required: true,
			hideHandle: true
		},
		{
			name: "value",
			type: TaskParamType.NUMBER,
			helperText: "Value",
			required: true,
			hideHandle: true
		}

	] as const,
	outputs: [
		{ name: "Response", type: TaskParamType.NUMBER }
	] as const,
	settings: nodeSettings,
	credits: 5
} satisfies WorkflowTask
