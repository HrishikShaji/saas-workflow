
import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, GlobeIcon, LucideProps } from "lucide-react";

export const PageToHtmlTask = {
	type: TaskType.PAGE_TO_HTML,
	label: "Get html from page",
	icon: (props: LucideProps) => (
		<CodeIcon className="stroke-rose-400" {...props} />
	),
	isEntryPoint: false,
	inputs: [
		{
			name: "Website URL",
			type: TaskParamType.BROWSER_INSTANCE,
			required: true,
		}
	] as const,
	outputs: [
		{
			name: "Html",
			type: TaskParamType.STRING
		},
		{
			name: "Web page",
			type: TaskParamType.BROWSER_INSTANCE
		}
	] as const,
	settings: nodeSettings,
	credits: 2
} satisfies WorkflowTask
