"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createFlowNode } from "@/lib/workflow/createFlowNode"
import { TaskRegistry } from "@/lib/workflow/task/registry"
import { AppNode } from "@/types/appNode"
import { TaskType } from "@/types/task"
import { useReactFlow } from "@xyflow/react"
import { CoinsIcon, CopyIcon, GripVerticalIcon, Settings, TrashIcon } from "lucide-react"
import { addListener } from "process"
import NodeSettings from "./NodeSettings"

interface Props {
	taskType: TaskType;
	nodeId: string;
}

export default function NodeHeader({ taskType, nodeId }: Props) {
	const task = TaskRegistry[taskType]
	const { deleteElements, getNode, addNodes } = useReactFlow()
	return <div className="flex items-center gap-2 p-2">
		<task.icon size={16} />
		<div className="flex justify-between items-center w-full">
			<p className="text-xs font-bold uppercase text-muted-foreground">
				{task.label}
			</p>
			<div className="flex gap-1 items-center">
				{task.isEntryPoint && <Badge>Entry point</Badge>}
				{/*
				<Badge className="gap-2 flex items-center text-xs">
					<CoinsIcon size={16} />
					{task.credits}
				</Badge>
				*/}
				<Button variant="ghost" size="icon"
					onClick={() => {
						deleteElements({ nodes: [{ id: nodeId }] })
					}}
				><TrashIcon size={12} /></Button>
				{!task.isEntryPoint && (
					<>
						<Button variant="ghost" size="icon"
							onClick={() => {
								const node = getNode(nodeId) as AppNode
								const newX = node.position.x;
								const newY = node.position.y + node.measured?.height! + 20
								const newNode = createFlowNode(node.data.type, { x: newX, y: newY })
								addNodes([newNode])
							}}
						><CopyIcon size={12} /></Button>
					</>
				)}
				<NodeSettings nodeId={nodeId} task={task} />
				<Button
					variant="ghost"
					size="icon"
					className="drag-handle cursor-grab"
				>
					<GripVerticalIcon size={20} />
				</Button>
			</div>
		</div>
	</div>
}
