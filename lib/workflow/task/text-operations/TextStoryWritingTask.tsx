import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, File, GlobeIcon, LucideProps } from "lucide-react";


export const TextStoryWritingTask = {
	type: TaskType.TEXT_STORY_WRITING,
	label: "Text Story Writing",
	icon: (props: LucideProps) => (
		<File className="stroke-pink-500" {...props} />
	),
	isEntryPoint: true,
	inputs: [
		{
			name: "contentType",
			type: TaskParamType.STRING,
			helperText: "story script",
			required: true,
			hideHandle: true
		},
		{
			name: "genre",
			type: TaskParamType.STRING,
			helperText: "genre",
			required: true,
			hideHandle: true,
		},
		{
			name: "premise",
			type: TaskParamType.STRING,
			helperText: "premise",
			required: true,
			hideHandle: true
		},
		{
			name: "length",
			type: TaskParamType.STRING,
			helperText: "small medium large",
			required: true,
			hideHandle: true
		},
		{
			name: "tone",
			type: TaskParamType.STRING,
			helperText: "professional friendly",
			required: true,
			hideHandle: true
		},
		{
			name: "characterDescriptions",
			type: TaskParamType.STRING,
			helperText: "describe characters",
			required: true,
			hideHandle: true
		},
		{
			name: "pointOfView",
			type: TaskParamType.STRING,
			helperText: "first third",
			required: true,
			hideHandle: true
		},
		{
			name: "format",
			type: TaskParamType.STRING,
			helperText: "screenplay",
			required: true,
			hideHandle: true
		},

	] as const,
	outputs: [
		{ name: "AI Response", type: TaskParamType.AI_RESPONSE }
	] as const,
	settings: nodeSettings,
	credits: 5
} satisfies WorkflowTask
