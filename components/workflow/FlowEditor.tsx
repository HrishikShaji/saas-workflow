import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import NodeComponent from "./nodes/NodeComponent"
import { useCallback, useEffect } from "react"
import { Workflow } from "@/lib/generated/prisma"
import { createFlowNode } from "@/lib/workflow/createFlowNode"
import { TaskType } from "@/types/task"
import { AppNode } from "@/types/appNode"


interface Props {
	workflow: Workflow
}

const nodeTypes = {
	FlowScrapeNode: NodeComponent
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = { padding: 2 }

export default function FlowEditor({ workflow }: Props) {
	const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([])
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
	const { setViewport, screenToFlowPosition } = useReactFlow()

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

	const onDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move"
	}, [])

	const onDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		const taskType = e.dataTransfer.getData("application/reactflow")
		if (typeof taskType === undefined || !taskType) return;
		const position = screenToFlowPosition({
			x: e.clientX,
			y: e.clientY
		})
		const newNode = createFlowNode(taskType as TaskType, position)

		setNodes(nodes => nodes.concat(newNode))
	}, [])

	const onConnect = useCallback((connection: Connection) => {
		setEdges((edges) => addEdge({ ...connection, animated: true }, edges))
	}, [])

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
			onDragOver={onDragOver}
			onDrop={onDrop}
			onConnect={onConnect}
		>
			<Controls fitViewOptions={fitViewOptions} position="top-left" />
			<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
		</ReactFlow>
	</main>
}
