import { createFlowNode } from "@/lib/workflow/createFlowNode"
import { TaskType } from "@/types/task"
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import NodeComponent from "./nodes/NodeComponent"


interface Props {
	workflow: Workflow
}

const nodeTypes = {
	Node: NodeComponent
}

export default function FlowEditor({ workflow }: Props) {
	const [nodes, setNodes, onNodesChange] = useNodesState([createFlowNode(TaskType.LAUNCH_BROWSER)])
	const [edges, setEdges, onEdgesChange] = useEdgesState([])

	return <main className="h-full w-full">
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			nodeTypes={nodeTypes}
		>
			<Controls position="top-left" />
			<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
		</ReactFlow>
	</main>
}
