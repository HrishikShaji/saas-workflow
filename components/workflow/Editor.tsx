"use client"

import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";
import Topbar from "./Topbar";
import { Workflow } from "@/lib/generated/prisma";
import TaskMenu from "./TaskMenu";
import { FlowValidationContextProvider } from "../contexts/FlowValidationContext";

interface Props {
	workflow: Workflow
}

export default function Editor({ workflow }: Props) {
	return <FlowValidationContextProvider>
		<ReactFlowProvider>
			<div className="flex flex-col h-full w-full overflow-hidden rounded-3xl border-2 border-black">
				<Topbar title="Workflow Editor" subTitle={workflow.name} workflowId={workflow.id} />
				<section className="flex h-full overflow-auto">
					<TaskMenu />
					<FlowEditor workflow={workflow} />
				</section>
			</div>
		</ReactFlowProvider>
	</FlowValidationContextProvider>
}
