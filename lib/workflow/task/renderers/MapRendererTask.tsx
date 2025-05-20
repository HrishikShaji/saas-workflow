
import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, GlobeIcon, LucideProps } from "lucide-react";

export const MapRendererTask = {
	type: TaskType.MAP_RENDERER,
	label: "Map Renderer",
	icon: (props: LucideProps) => (
		<Bot className="stroke-pink-500" {...props} />
	),
	isEntryPoint: false,
	inputs: [
		{
			name: "mapData",
			type: TaskParamType.STRING,
			helperText: "Map data",
			required: true,
			hideHandle: false
		},

	] as const,
	outputs: [
		{ name: "Map Response", type: TaskParamType.STRING }
	] as const,
	settings: nodeSettings,
	credits: 5
} satisfies WorkflowTask
