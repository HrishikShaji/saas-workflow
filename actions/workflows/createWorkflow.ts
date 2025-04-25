"use server"

import { prisma } from "@/lib/prisma";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { createWorkflowSchema, CreateWorkflowSchemaType } from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createWorkflow(form: CreateWorkflowSchemaType) {
	const { success, data } = createWorkflowSchema.safeParse(form)
	if (!success) {
		throw new Error("invalid data")
	}

	const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
		nodes: [],
		edges: []
	}

	initialFlow.nodes.push(createFlowNode(TaskType.LAUNCH_BROWSER))

	const result = await prisma.workflow.create({
		data: {
			status: WorkflowStatus.DRAFT,
			definition: JSON.stringify(initialFlow),
			...data

		}
	})

	if (!result) {
		throw new Error("failed to create workflow")
	}

	return result

}
