import Editor from "@/components/workflow/Editor";
import { prisma } from "@/lib/prisma";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })
type tParams = Promise<{ id: string }>;

export default async function Page({ params }: { params: tParams }) {

	const { id } = await params
	const workflow = await prisma.workflow.findUnique({
		where: {
			id
		}
	})

	if (!workflow) {
		return <div>Workflow not found</div>
	}

	return <div className={`h-screen  bg-neutral-200 ${poppins.className} `}>
		<Editor workflow={workflow} />
	</div>
}
