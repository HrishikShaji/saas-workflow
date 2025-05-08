import { nodeSettings } from "@/lib/constants";
import { SettingsParamType } from "@/types/settings";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, Database, GlobeIcon, LucideProps } from "lucide-react";

export const DatabaseOperatorTask = {
	type: TaskType.DATABASE_OPERATOR,
	label: "Database Operator",
	icon: (props: LucideProps) => (
		<Database className="stroke-pink-500" {...props} />
	),
	isEntryPoint: false,
	inputs: [
		{
			name: "method",
			type: TaskParamType.STRING,
			helperText: "enter the method",
			required: true,
			hideHandle: false
		},
		{
			name: "query",
			type: TaskParamType.STRING,
			helperText: "get me 10 users",
			required: true,
			hideHandle: false
		}

	] as const,
	outputs: [
		{ name: "Response", type: TaskParamType.STRING }
	] as const,
	settings: nodeSettings,
	credits: 5
} satisfies WorkflowTask
