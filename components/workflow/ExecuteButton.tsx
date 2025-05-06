import { PlayIcon } from "lucide-react";
import { Button } from "../ui/button";
import useExecutionPlan from "../hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { runWorkflow } from "@/actions/workflows/runWorkflow";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";
import { useRouter } from "next/navigation";

interface Props {
	workflowId: string;
}

export default function ExecuteButton({ workflowId }: Props) {
	const generate = useExecutionPlan()
	const router = useRouter()
	const { toObject } = useReactFlow()

	const { mutate, isPending, error } = useMutation({
		mutationFn: runWorkflow,
		onSuccess: (execution) => {
			toast.success("Execution started", { id: "flow-execution" })
			router.push(`/workflow/runs/${workflowId}/${execution.id}`)
		},
		onError: () => toast.error("Something has went wrong", { id: "flow-execution" })
	})

	//	console.log(error)


	return <Button
		onClick={() => {
			const plan = generate();
			if (!plan) {
				return;
			}

			mutate({
				workflowId,
				flowDefinition: JSON.stringify(toObject())

			})
		}}
		disabled={isPending}
		variant="outline" className=" flex items-center gap-2">
		<PlayIcon size={16} className="stroke-orange-500" />
		Execute
	</Button>
}
