"use client"

import { Workflow } from "@/lib/generated/prisma"
import { Card, CardContent } from "../ui/card"
import { WorkflowStatus } from "@/types/workflow"
import { FileTextIcon, MoreVerticalIcon, PlayIcon, Shuffle, ShuffleIcon, TrashIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import TooltipWrapper from "./TooltipWrapper"
import { useState } from "react"
import DeleteWorkflowDialog from "./DeleteWorkflowDialog"

interface Props {
	workflow: Workflow
}

const statusColors = {
	[WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
	[WorkflowStatus.PUBLISHED]: "bg-primary"
}

export default function WorkflowCard({ workflow }: Props) {
	const isDraft = workflow.status === WorkflowStatus.DRAFT
	return <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30">
		<CardContent className="p-4 flex items-center justify-between h-[100px]">
			<div className="flex items-center justify-end space-x-3">
				<div className={cn("size-10 rounded-full flex items-center  justify-center ",
					statusColors[workflow.status as WorkflowStatus]
				)}>
					{isDraft ? <FileTextIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5 text-white" />}
				</div>
				<div className="text-base font-bold text-muted-foreground flex items-center">
					<Link href={`/workflow/editor/${workflow.id}`} className="flex items-center hover:underline">
						{workflow.name}
					</Link>
					{isDraft && (
						<span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
							Draft
						</span>
					)}
				</div>

			</div>
			<div className="flex items-center space-x-2">
				<Link href={`/workflow/editor/${workflow.id}`} className={cn(buttonVariants({ variant: "outline" }), "flex items-center gap-2")}>
					<ShuffleIcon size={16} /> Edit
				</Link>
				<WorkflowActions workflowName={workflow.name} workflowId={workflow.id} />
			</div>
		</CardContent>
	</Card>
}


function WorkflowActions({ workflowName, workflowId }: { workflowId: string; workflowName: string }) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)
	return <>
		<DeleteWorkflowDialog workflowId={workflowId} workflowName={workflowName} open={showDeleteDialog} setOpen={setShowDeleteDialog} />
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					<TooltipWrapper content="More actions">
						<div className="flex items-center justify-center w-full h-full">
							<MoreVerticalIcon size={18} />
						</div>
					</TooltipWrapper>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onSelect={() => {
						setShowDeleteDialog(prev => !prev)
					}}
					className="text-destructive flex items-center gap-2">
					<TrashIcon size={16} />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</>
}
