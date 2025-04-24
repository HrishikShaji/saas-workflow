import { AppNode } from "@/types/appNode";
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";
import { getISODay } from "date-fns";

type FlowToExectionPlan = {
	executionPlan?: WorkflowExecutionPlan
}

export function flowToExecutionPlan(nodes: AppNode[], edges: Edge[]): FlowToExectionPlan {
	const entryPoint = nodes.find((node) => TaskRegistry[node.data.type].isEntryPoint)

	if (!entryPoint) {
		throw new Error("Error no entry point")
	}
	const planned = new Set<string>();
	const executionPlan: WorkflowExecutionPlan = [
		{
			phase: 1,
			nodes: [entryPoint]
		}
	];

	for (let phase = 2; phase <= nodes.length || planned.size < nodes.length; phase++) {
		const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] }
		for (const currentNode of nodes) {
			if (planned.has(currentNode.id)) {
				continue
			}
			const invalidInputs = getInvalidInputs(currentNode, edges, planned)

			if (invalidInputs.length > 0) {
				const incomers = getIncomers(currentNode, nodes, edges)
				if (incomers.every((incomer) => planned.has(incomer.id))) {
					console.error("invalid inputs", currentNode.id, invalidInputs)
					throw new Error("Handle error")
				} else {
					continue
				}
			}

			nextPhase.nodes.push(currentNode);
			planned.add(currentNode.id)

		}

	}

	return { executionPlan }
}


function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
	const invalidInputs = [];
	const inputs = TaskRegistry[node.data.type].inputs;
	for (const input of inputs) {
		const inputValue = node.data.inputs[input.name]
		const inputValueProvided = inputValue?.length > 0;

		if (inputValueProvided) {
			continue;
		}

		const incomingEdges = edges.filter((edge) => edge.target === node.id)

		const inputLinkedToOutput = incomingEdges.find((edge) => edge.targetHandle === input.name)

		const requiredInputProvidedByVisitedOutput = input.required && inputLinkedToOutput && planned.has(inputLinkedToOutput.source)

		if (requiredInputProvidedByVisitedOutput) {
			continue
		} else if (!input.required) {
			if (!inputLinkedToOutput) continue;
			if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
				continue;
			}
		}

		invalidInputs.push(input.name)

	}

	return invalidInputs;
}
