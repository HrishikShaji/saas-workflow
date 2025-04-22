"use server"

import { prisma } from "@/lib/prisma"

export async function getWorkflowsForUser() {
	return prisma.workflow.findMany({
		orderBy: {
			createdAt: "asc"
		}
	})
}

