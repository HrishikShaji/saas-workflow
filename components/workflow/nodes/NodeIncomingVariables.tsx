import { getIncomers, Node, useReactFlow } from "@xyflow/react";
import IncomingNodeCard from "./IncomingNodeCard";
import { useCallback } from "react";
import { AppNode, AppNodeData } from "@/types/appNode";

interface Props {
	nodeId: string;
}

export default function NodeIncomingVariables({ nodeId }: Props) {
	console.log("@@NODEID", nodeId)
	const { getNodes, getEdges, getNode, updateNodeData } = useReactFlow()
	const nodes = getNodes()
	const edges = getEdges()
	const node = getNode(nodeId) as Node<AppNodeData>


	const updateNodeParamValue = useCallback((newValue: string) => {
		if (node) {
			updateNodeData(nodeId, {
				settings: {
					...node.data.settings,
					["Output format"]: newValue
				}
			})
		}
	}, [updateNodeData, node?.data.settings, nodeId])
	if (!node) return null

	const incomingNodes = getIncomers(node, nodes, edges)
	//console.log("@@INCOMING NODES", incomingNodes)

	if (incomingNodes.length === 0) {
		return <div>No incoming variables</div>
	}
	return <div>
		{incomingNodes.map((node) => (
			<IncomingNodeCard currentNodeId={nodeId} updateNodeParamValue={updateNodeParamValue} key={node.id} node={node} />
		))}
	</div>
}


