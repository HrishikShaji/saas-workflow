import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, Database, GlobeIcon, LucideProps } from "lucide-react";

export const DatabaseAnalyserTask = {
	type: TaskType.DATABASE_ANALYSER,
	label: "Database Analyser",
	icon: (props: LucideProps) => (
		<Database className="stroke-pink-500" {...props} />
	),
	isEntryPoint: false,
	inputs: [
		{
			name: "Database Instance",
			type: TaskParamType.DATABASE_INSTANCE,
			helperText: "database instance",
			required: true,
			hideHandle: false
		},

	] as const,
	outputs: [
		{ name: "Database Collections", type: TaskParamType.STRING }
	] as const,
	settings: nodeSettings,
	credits: 5
} satisfies WorkflowTask
