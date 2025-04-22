"use server"

import { prisma } from "@/lib/prisma";
import { createWorkflowSchema, CreateWorkflowSchemaType } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createWorkflow(form: CreateWorkflowSchemaType) {
	const { success, data } = createWorkflowSchema.safeParse(form)
	if (!success) {
		throw new Error("invalid data")
	}

	const result = await prisma.workflow.create({
		data: {
			status: WorkflowStatus.DRAFT,
			definition: "TODO",
			...data

		}
	})

	if (!result) {
		throw new Error("failed to create workflow")
	}

	redirect(`/workflow/editor/${result.id}`)

}
