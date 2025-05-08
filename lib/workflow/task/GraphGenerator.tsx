
import { nodeSettings } from "@/lib/constants";
import { SettingsParamType } from "@/types/settings";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, Database, GitGraph, GlobeIcon, LucideProps } from "lucide-react";

export const GraphGeneratorTask = {
	type: TaskType.GRAPH_GENERATOR,
	label: "Graph Generator",
	icon: (props: LucideProps) => (
		<GitGraph className="stroke-pink-500" {...props} />
	),
	isEntryPoint: false,
	inputs: [
		{
			name: "Chart Data",
			type: TaskParamType.STRING,
			helperText: "chart data",
			required: true,
			hideHandle: false
		},

	] as const,
	outputs: [
		{ name: "Graph Response", type: TaskParamType.STRING }
	] as const,
	settings: nodeSettings,
	credits: 5
} satisfies WorkflowTask
