import { nodeSettings } from "@/lib/constants";
import { SettingsParamType } from "@/types/settings";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, Database, GlobeIcon, LucideProps } from "lucide-react";

export const DatabaseConnectorTask = {
	type: TaskType.DATABASE_CONNECTOR,
	label: "Database Connector",
	icon: (props: LucideProps) => (
		<Database className="stroke-pink-500" {...props} />
	),
	isEntryPoint: true,
	inputs: [
		{
			name: "Database URL",
			type: TaskParamType.STRING,
			helperText: "enter the database url",
			required: true,
			hideHandle: true
		},
		{
			name: "Database Provider",
			type: TaskParamType.STRING,
			helperText: "MongoDB or MySQL",
			required: true,
			hideHandle: true
		}

	] as const,
	outputs: [
		{ name: "Database", type: TaskParamType.DATABASE_INSTANCE }
	] as const,
	settings: nodeSettings,
	credits: 5
} satisfies WorkflowTask
