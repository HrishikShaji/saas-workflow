import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, File, GlobeIcon, LucideProps } from "lucide-react";


export const TextMessageDraftingTask = {
	type: TaskType.TEXT_MESSAGE_DRAFTING,
	label: "Text Message Drafting",
	icon: (props: LucideProps) => (
		<File className="stroke-pink-500" {...props} />
	),
	isEntryPoint: true,
	inputs: [
		{
			name: "messageType",
			type: TaskParamType.STRING,
			helperText: "email message",
			required: true,
			hideHandle: true
		},
		{
			name: "recipient",
			type: TaskParamType.STRING,
			helperText: "john doe",
			required: true,
			hideHandle: true,
		},
		{
			name: "sender",
			type: TaskParamType.STRING,
			helperText: "hrishik",
			required: true,
			hideHandle: true
		},
		{
			name: "purpose",
			type: TaskParamType.STRING,
			helperText: "purpose",
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
			helperText: "professional",
			required: true,
			hideHandle: true
		},
		{
			name: "platform",
			type: TaskParamType.STRING,
			helperText: "general",
			required: true,
			hideHandle: true
		},
		{
			name: "relationship",
			type: TaskParamType.STRING,
			helperText: "relation",
			required: true,
			hideHandle: true
		},
		{
			name: "keyPoints",
			type: TaskParamType.STRING,
			helperText: "JSON",
			required: true,
			hideHandle: true
		},
		{
			name: "additionalDetails",
			type: TaskParamType.STRING,
			helperText: "Additional Details",
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
