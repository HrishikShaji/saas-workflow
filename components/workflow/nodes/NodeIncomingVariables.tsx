import { getIncomers, Node, useReactFlow } from "@xyflow/react";
import IncomingNodeCard from "./IncomingNodeCard";

interface Props {
	nodeId: string;
}

export default function NodeIncomingVariables({ nodeId }: Props) {
	console.log("@@NODEID", nodeId)
	const { getNodes, getEdges, getNode } = useReactFlow()
	const nodes = getNodes()
	const edges = getEdges()
	const node = getNode(nodeId)

	if (!node) return null

	const incomingNodes = getIncomers(node, nodes, edges)
	//console.log("@@INCOMING NODES", incomingNodes)

	if (incomingNodes.length === 0) {
		return <div>No incoming variables</div>
	}
	return <div>
		{incomingNodes.map((node) => (
			<IncomingNodeCard key={node.id} node={node} />
		))}
	</div>
}


