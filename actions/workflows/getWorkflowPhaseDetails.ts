"use server"

import { prisma } from "@/lib/prisma"

export async function getWorkflowPhaseDetails(phaseId: string) {
	return prisma.executionPhase.findUnique({
		where: { id: phaseId },
		include: {
			logs: {
				orderBy: {
					timestamp: "asc"
				}
			}
		}
	})
}
