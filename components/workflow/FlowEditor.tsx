import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import NodeComponent from "./nodes/NodeComponent"
import { useEffect } from "react"
import { Workflow } from "@/lib/generated/prisma"


interface Props {
	workflow: Workflow
}

const nodeTypes = {
	FlowScrapeNode: NodeComponent
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = { padding: 2 }

export default function FlowEditor({ workflow }: Props) {
	const [nodes, setNodes, onNodesChange] = useNodesState([])
	const [edges, setEdges, onEdgesChange] = useEdgesState([])
	const { setViewport } = useReactFlow()

	useEffect(() => {
		try {
			const flow = JSON.parse(workflow.definition)
			if (!flow) return
			setNodes(flow.nodes || [])
			setEdges(flow.edges || [])
			if (!flow.viewport) return;
			const { x = 0, y = 0, zoom = 1 } = flow.viewport
			setViewport({ x, y, zoom })
		} catch (error) {

		}
	}, [workflow.definition, setEdges, setNodes])

	return <main className="h-full w-full">
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			nodeTypes={nodeTypes}
			snapToGrid={true}
			snapGrid={snapGrid}
			fitView
			fitViewOptions={fitViewOptions}
		>
			<Controls fitViewOptions={fitViewOptions} position="top-left" />
			<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
		</ReactFlow>
	</main>
}
