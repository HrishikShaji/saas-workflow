import { TaskParamType } from "@/types/task";

export const colorForHandle: Record<TaskParamType, string> = {
	BROWSER_INSTANCE: "!bg-sky-400",
	STRING: "!bg-amber-400",
	AI_RESPONSE: "!bg-blue-500",
	OPTIONS: "!bg-green-500",
	NUMBER: "!bg-red-500",
	DATABASE_INSTANCE: "!bg-purple-500"
}

export const colorForEdge: Record<TaskParamType, string> = {
	BROWSER_INSTANCE: "#38bdf8",
	STRING: "#fbbf24",
	AI_RESPONSE: "#3b82f6",
	OPTIONS: "#22c55e",
	NUMBER: "#ef4444",
	DATABASE_INSTANCE: '#a855f7'
}
