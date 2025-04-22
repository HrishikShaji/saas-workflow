import Editor from "@/components/workflow/Editor";
import { prisma } from "@/lib/prisma";

export default async function Page({ params }: { params: { id: string } }) {
	const { id } = params

	const workflow = await prisma.workflow.findUnique({
		where: {
			id
		}
	})

	if (!workflow) {
		return <div>Workflow not found</div>
	}

	return <div className="h-screen p-20 bg-neutral-200">
		<Editor workflow={workflow} />
	</div>
}
