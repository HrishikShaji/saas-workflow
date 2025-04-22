"use server"

import { prisma } from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";

export async function updateWorkflow({ definition, id }: { definition: string; id: string }) {
	const workflow = await prisma.workflow.findUnique({
		where: {
			id
		}
	})

	if (!workflow) throw new Error("workflow not found")
	if (workflow.status !== WorkflowStatus.DRAFT) {
		throw new Error("workflow is not a draft")
	}

	await prisma.workflow.update({
		data: {
			definition
		},
		where: {
			id
		}
	})

	revalidatePath("/")
}
