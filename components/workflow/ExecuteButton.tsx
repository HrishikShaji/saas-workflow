import { PlayIcon } from "lucide-react";
import { Button } from "../ui/button";
import useExecutionPlan from "../hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { runWorkflow } from "@/actions/workflows/runWorkflow";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";

interface Props {
	workflowId: string;
}

export default function ExecuteButton({ workflowId }: Props) {
	const generate = useExecutionPlan()
	const { toObject } = useReactFlow()

	const { mutate, isPending } = useMutation({
		mutationFn: runWorkflow,
		onSuccess: () => toast.success("Execution started", { id: "flow-execution" }),
		onError: () => toast.error("Something went wrong", { id: "flow-execution" })
	})
	return <Button
		onClick={() => {
			const plan = generate();
			if (!plan) {
				return;
			}

			mutate({
				worklowId: workflowId,
				flowDefinition: JSON.stringify(toObject())

			})
		}}
		disabled={isPending}
		variant="outline" className="flex items-center gap-2">
		<PlayIcon size={16} className="stroke-orange-500" />
		Execute
	</Button>
}
