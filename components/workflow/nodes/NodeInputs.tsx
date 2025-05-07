import { ReactNode } from "react";
import { Handle, Position, useEdges } from "@xyflow/react"
import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import NodeParamField from "./NodeParamField";
import { colorForHandle } from "./common";
import useFlowValidation from "@/components/hooks/useFlowValidation";

interface Props {
	children: ReactNode;
}

export function NodeInputs({ children }: Props) {
	return <div className="flex flex-col divide-y gap-2">{children}</div>
}

export function NodeInput({ input, nodeId }: { input: TaskParam; nodeId: string }) {
	const edges = useEdges()
	const { invalidInputs } = useFlowValidation()
	const isConnected = edges.some(edge => edge.target === nodeId && edge.targetHandle?.split("-")[0] === input.name)

	const hasErrors = invalidInputs.find((node) => node.nodeId === nodeId)?.inputs.find((invalidInput) => invalidInput === input.name)

	return <div className={cn("flex justify-start relative p-3 bg-secondary w-full", hasErrors && "bg-destructive/30")}>
		<NodeParamField disabled={isConnected} param={input} nodeId={nodeId} />
		{!input.hideHandle && (
			<Handle
				isConnectable={!isConnected}
				id={`${input.name}-${input.type}`}
				type="target"
				position={Position.Left}
				className={cn("!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4", colorForHandle[input.type])}
			/>
		)}
	</div>
}
