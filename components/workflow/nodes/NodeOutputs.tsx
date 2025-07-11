"use client"

import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import { ReactNode } from "react";
import { colorForHandle } from "./common";

interface Props {
	children: ReactNode;
}

export function NodeOutputs({ children }: Props) {
	return <div className="flex flex-col gap-1 divide-y">{children}</div>
}

export function NodeOutput({ output }: { output: TaskParam }) {
	return <div className="flex justify-end relative p-3 bg-secondary">
		<p className="text-xs text-muted-foreground">{output.name}</p>
		<Handle id={`${output.name}-${output.type}`} type="source" position={Position.Right}
			className={cn("!bg-muted-foreground !border-2 !border-background !-right-2 !w-4 !h-4", colorForHandle[output.type])}
		/>
	</div>
}
