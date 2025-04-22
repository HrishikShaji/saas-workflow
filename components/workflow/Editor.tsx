"use client"

import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";

interface Props {
	workflow: Workflow
}

export default function Editor({ workflow }: Props) {
	return <ReactFlowProvider>
		<div className="flex flex-col h-full w-full overflow-hidden rounded-3xl border-2 border-black">
			<section className="flex h-full overflow-auto">
				<FlowEditor workflow={workflow} />
			</section>
		</div>
	</ReactFlowProvider>
}
