import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import NodeComponent from "./nodes/NodeComponent"
import { useCallback, useEffect } from "react"
import { Workflow } from "@/lib/generated/prisma"
import { createFlowNode } from "@/lib/workflow/createFlowNode"
import { TaskType } from "@/types/task"
import { AppNode } from "@/types/appNode"
import DeletableEdge from "./edges/DeletableEdge"
import { TaskRegistry } from "@/lib/workflow/task/registry"


interface Props {
	workflow: Workflow
}

const nodeTypes = {
	FlowScrapeNode: NodeComponent
}

const edgeTypes = {
	default: DeletableEdge
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = { padding: 2 }

export default function FlowEditor({ workflow }: Props) {
	const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([])
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
	const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow()

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
		console.log("this is connection", connection)
		if (!connection.targetHandle) return;
		const node = nodes.find((node) => node.id === connection.target)
		if (!node) return;
		setEdges((edges) => addEdge({ ...connection, animated: true }, edges))
		//		console.log("this is connection", connection)
		const nodeInputs = node.data.inputs
		updateNodeData(node.id, {
			inputs: {
				...nodeInputs,
				[connection.targetHandle.split("-")[0]]: ""
			}
		})

		//		console.log("@updated node", node.id)
	}, [setEdges, updateNodeData, nodes])

	//	console.log(nodes)

	const isValidConnection = useCallback((connection: Edge | Connection) => {

		//no self connection allowed
		//console.log("this is connection source and target", connection.sourceHandle, connection.targetHandle)
		if (connection.target === connection.source) {
			return false
		}
		//same taskparam type connection
		const source = nodes.find((node) => node.id === connection.source)
		const target = nodes.find((node) => node.id === connection.target)

		if (!source || !target) return false

		const sourceTask = TaskRegistry[source.data.type]
		const targetTask = TaskRegistry[target.data.type]

		console.log("@@SOURCE-TASK", sourceTask)
		console.log("@@TARGET-TASK", targetTask)

		const [sourceHandleId, sourceHandleType] = connection.sourceHandle?.split("-") as string[]
		const [targetHandleId, targetHandleType] = connection.targetHandle?.split("-") as string[]

		console.log("@@SOURCE-HANDLE-ID", sourceHandleId)
		console.log("@@SOURCE-TYPE", sourceHandleType)
		console.log("@@TARGET-HANDLE-ID", targetHandleId)
		console.log("@@TARGET-TYPE", targetHandleType)

		const output = sourceTask.outputs.find((o) => o.name === sourceHandleId)
		const input = targetTask.inputs.find((o) => o.name === targetHandleId)

		if (input?.type !== output?.type) {
			console.log("Type is not same", output, input)
			return false
		}


		const hasCycle = (node: AppNode, visited = new Set()) => {
			if (visited.has(node.id)) return false;

			visited.add(node.id);

			for (const outgoer of getOutgoers(node, nodes, edges)) {
				if (outgoer.id === connection.source) return true;
				if (hasCycle(outgoer, visited)) return true;
			}
		};

		const detectedCycle = hasCycle(target)
		return !detectedCycle

	}, [nodes])

	return <main className="h-full w-full">
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			nodeTypes={nodeTypes}
			//			snapToGrid={true}
			//			snapGrid={snapGrid}
			fitView
			fitViewOptions={fitViewOptions}
			onDragOver={onDragOver}
			onDrop={onDrop}
			onConnect={onConnect}
			edgeTypes={edgeTypes}
			isValidConnection={isValidConnection}
		>
			<Controls fitViewOptions={fitViewOptions} position="top-left" />
			<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
		</ReactFlow>
	</main>
}

