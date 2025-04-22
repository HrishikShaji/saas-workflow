import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import { deleteWorkflow } from "@/actions/workflows/deleteWorkflow";
import { toast } from "sonner";

interface Props {
	open: boolean;
	setOpen: (open: boolean) => void;
	workflowName: string;
	workflowId: string;
}

export default function DeleteWorkflowDialog({ open, setOpen, workflowName, workflowId }: Props) {
	const [confirmText, setConfirmText] = useState("")

	const { isPending, data, mutate } = useMutation({
		mutationFn: deleteWorkflow,
		onSuccess: () => {
			toast.success("Workflow deleted successfully", { id: workflowId })
			setConfirmText("")
		},
		onError: () => {
			toast.error("Something went wrong", { id: workflowId })
		}
	})

	return <AlertDialog open={open} onOpenChange={setOpen}>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Are you sure?</AlertDialogTitle>
				<AlertDialogDescription>
					If you delete this workflow,you will not be able to restore it
					<span className="flex flex-col py-4 gap-2">
						<span>If you are sure,Enter <span>{workflowName}</span>to confirm:</span>
						<Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
					</span>
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel onClick={() => setConfirmText("")}>Cancel</AlertDialogCancel>
				<AlertDialogAction disabled={confirmText !== workflowName || isPending}
					onClick={() => {
						toast.loading("Deleting workflow...", { id: workflowId })
						mutate(workflowId)
					}}
					className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
}
