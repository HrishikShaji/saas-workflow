import { AppNode, AppNodeData } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { nodeSettings, providersOrder } from "../constants";

export function createFlowNode(nodeType: TaskType, position?: { x: number; y: number }): AppNode {
	return {
		id: crypto.randomUUID(),
		dragHandle: ".drag-handle",
		type: "FlowScrapeNode",
		data: {
			type: nodeType,
			inputs: {},
			settings: {
				"Model": "meta-llama/llama-4-maverick",
				"Temperature": "0.3",
				"Max Tokens": "2000",
				"Providers Order": JSON.stringify(providersOrder)
			},
		},
		position: position ?? { x: 0, y: 0 }
	}
}
