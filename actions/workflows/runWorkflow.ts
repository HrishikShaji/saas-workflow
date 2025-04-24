"use server"

import { prisma } from "@/lib/prisma";
import { flowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from "@/types/workflow";
import { redirect } from "next/navigation";

export async function runWorkflow(form: { workflowId: string; flowDefinition?: string }) {
	const { workflowId, flowDefinition } = form;

	if (!workflowId) {
		throw new Error("workflowId is required")
	}

	const workflow = await prisma.workflow.findUnique({
		where: {
			id: workflowId
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

	const execution = await prisma.workflowExecution.create({
		data: {
			workflowId,
			status: WorkflowExecutionStatus.PENDING,
			startedAt: new Date(),
			trigger: WorkflowExecutionTrigger.MANUAL,
			phases: {
				create: executionPlan.flatMap(phase => {
					return phase.nodes.flatMap((node) => {
						return {
							status: ExecutionPhaseStatus.CREATED,
							number: phase.phase,
							node: JSON.stringify(node),
							name: TaskRegistry[node.data.type].label,
						}
					})
				})
			}
		},
		select: {
			id: true,
			phases: true
		}
	})


	if (!execution) {
		throw new Error("workflow execution not created")
	}

	redirect(`/workflows/runs/${workflowId}/${execution.id}`)
}
