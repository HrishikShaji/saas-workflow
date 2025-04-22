"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteWorkflow(id: string) {
	await prisma.workflow.delete({
		where: {
			id
		}
	})

	revalidatePath("/workflows")
}
