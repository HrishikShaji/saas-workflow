"use server"

import { prisma } from "@/lib/prisma";
import { flowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { WorkflowExecutionPlan } from "@/types/workflow";

export async function runWorkflow(form: { worklowId: string; flowDefinition?: string }) {
	const { worklowId, flowDefinition } = form;

	if (!worklowId) {
		throw new Error("workflowId is required")
	}

	const workflow = await prisma.workflow.findUnique({
		where: {
			id: worklowId
		}
	})

	if (!workflow) {
		throw new Error("no workflow found")
	}

	let executionPlan: WorkflowExecutionPlan

	if (!flowDefinition) {
		throw new Error("flow definition is undefined")
	}

	const flow = JSON.parse(flowDefinition)
	const result = flowToExecutionPlan(flow.nodes, flow.edges)

	if (result.error) {
		throw new Error("flow definition not valid")
	}

	if (!result.executionPlan) {
		throw new Error("no execution plan generated")
	}

	executionPlan = result.executionPlan;
	console.log("Execution plan", executionPlan)
}
