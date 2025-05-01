import { TaskParamType } from "@/types/task";

export const colorForHandle: Record<TaskParamType, string> = {
	BROWSER_INSTANCE: "!bg-sky-400",
	STRING: "!bg-amber-400",
	AI_RESPONSE: "!bg-blue-500",
	OPTIONS: "!bg-green-500"
}
