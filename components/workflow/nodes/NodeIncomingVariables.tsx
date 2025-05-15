import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode, AppNodeData } from "@/types/appNode";
import { getIncomers, Node, useReactFlow } from "@xyflow/react";
import { JsonEditor } from "json-edit-react"
import { useEffect, useState } from "react";

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

function IncomingNodeCard({ node }: { node: Node }) {
	const nodeData = node.data as AppNodeData
	const nodeType = TaskRegistry[nodeData.type]
	const [editorData, setEditorData] = useState(null)

	useEffect(() => {
		const schema = nodeData.settings["Schema"]
		if (schema) {
			try {
				const parsed = JSON.parse(schema)
				setEditorData(parsed)
			} catch (err) {
				console.error(err)
			}
		}
	}, [node])
	console.log("@@INCOMINGNODE", nodeType, nodeData)

	if (!editorData) {
		return <div>No incoming schema defined</div>
	}

	return <div>
		<h1>{nodeType.label}</h1>
		<div>
			<JsonEditor
				data={editorData}
			/>
		</div>
	</div>
}
