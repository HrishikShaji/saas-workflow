import { CheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useReactFlow } from "@xyflow/react";
import { useMutation } from "@tanstack/react-query";
import { updateWorkflow } from "@/actions/workflows/updateWorkflow";
import { toast } from "sonner";

interface Props {
	workflowId: string;
}

export default function SaveButton({ workflowId }: Props) {
	const { toObject } = useReactFlow()

	const { mutate, isPending } = useMutation({
		mutationFn: updateWorkflow,
		onSuccess: () => {
			toast.success("Saved successfully", { id: workflowId })
		},
		onError: () => {
			toast.error("Something went wrong", { id: workflowId })
		}
	})

	return <Button
		variant="outline"
		className="flex items-center gap-2"
		disabled={isPending}
		onClick={() => {
			const workFlowDefinition = JSON.stringify(toObject())
			mutate({
				id: workflowId,
				definition: workFlowDefinition
			})
		}}
	>
		<CheckIcon size={16} className="stroke-green-500" />
		Save
	</Button >
}
