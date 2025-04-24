"use server"

import { prisma } from "@/lib/prisma"

export async function getWorkflowExecutionWithPhases(executionId: string) {
	return prisma.workflowExecution.findUnique({
		where: {
			id: executionId
		},
		include: {
			phases: {
				orderBy: {
					number: "asc"
				}
			}
		}
	})
}
