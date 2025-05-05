import { AppNode, AppNodeData } from "@/types/appNode";
import { TaskType } from "@/types/task";

export function createFlowNode(nodeType: TaskType, position?: { x: number; y: number }): AppNode {
	return {
		id: crypto.randomUUID(),
		dragHandle: ".drag-handle",
		type: "FlowScrapeNode",
		data: {
			type: nodeType,
			inputs: {},
			settings: {},
		},
		position: position ?? { x: 0, y: 0 }
	}
}
