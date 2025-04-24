import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export default function useExecutionPlan() {
	const { toObject } = useReactFlow()
	const generateExecutionplan = useCallback(() => {
		const { nodes, edges } = toObject()

	}, [toObject])

	return generateExecutionplan
}
