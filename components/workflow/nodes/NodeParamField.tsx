import { Input } from "@/components/ui/input";
import { TaskParam, TaskParamType } from "@/types/task"
import StringParam from "./params/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import { useCallback } from "react";

interface Props {
	param: TaskParam;
	nodeId: string;
}

export default function NodeParamField({ param, nodeId }: Props) {

	const { updateNodeData, getNode } = useReactFlow()
	const node = getNode(nodeId) as AppNode

	const value = node?.data.inputs?.[param.name]
	const updateNodeParamValue = useCallback((newValue: string) => {
		updateNodeData(nodeId, {
			inputs: {
				...node?.data.inputs,
				[param.name]: newValue
			}
		})
	}, [param.name, updateNodeData, node?.data.inputs, nodeId])

	switch (param.type) {
		case TaskParamType.STRING:
			return <StringParam
				param={param}
				value={value}
				updateNodeParamValue={updateNodeParamValue}
			/>
		default: return (
			<div className="w-full">
				<p className="text-xs text-muted-foreground">Not implemented</p>
			</div>
		)
	}

}
