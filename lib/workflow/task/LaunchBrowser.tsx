import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
	type: TaskType.LAUNCH_BROWSER,
	label: "Launch Browser",
	icon: (props: LucideProps) => (
		<GlobeIcon className="stroke-pink-500" {...props} />
	),
	isEntryPoint: true,
	inputs: [
		{
			name: "Website URL",
			type: TaskParamType.STRING,
			helperText: "eg:https://www.sample.com",
			required: true,
			hideHandle: true
		}
	] as const,
	outputs: [
		{ name: "Web page", type: TaskParamType.BROWSER_INSTANCE }
	] as const,
	settings: nodeSettings,
	credits: 5
} satisfies WorkflowTask
