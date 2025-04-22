"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import CustomDialogHeader from "./CustomDialogHeader";
import { Layers2Icon } from "lucide-react";

interface Props {
	triggerText?: string;
}

export default function CreateWorkflowDialog({ triggerText }: Props) {
	const [open, setOpen] = useState(false)
	return <Dialog open={open} onOpenChange={setOpen}>
		<DialogTrigger asChild>
			<Button>{triggerText ?? "Create Workflow"}</Button>
		</DialogTrigger>
		<DialogContent className="px-0">
			<CustomDialogHeader
				icon={Layers2Icon}
				title="Create Workflow"
				subTitle="Start building your workflow"
			/>
		</DialogContent>
	</Dialog>
}
