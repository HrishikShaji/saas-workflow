import { AppNode, AppNodeData } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { nodeSettings } from "../constants";

export function createFlowNode(nodeType: TaskType, position?: { x: number; y: number }): AppNode {
	return {
		id: crypto.randomUUID(),
		dragHandle: ".drag-handle",
		type: "FlowScrapeNode",
		data: {
			type: nodeType,
			inputs: {},
			settings: {
				"Model": "meta-llama/llama-4-maverick"
			},
		},
		position: position ?? { x: 0, y: 0 }
	}
}
