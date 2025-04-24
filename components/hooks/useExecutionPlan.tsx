import { flowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export default function useExecutionPlan() {
	const { toObject } = useReactFlow()
	const generateExecutionplan = useCallback(() => {
		const { nodes, edges } = toObject()

		const { executionPlan } = flowToExecutionPlan(nodes as AppNode[], edges)

		return executionPlan
	}, [toObject])

	return generateExecutionplan
}
