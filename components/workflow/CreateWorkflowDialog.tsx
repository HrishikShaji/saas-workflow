"use client"

import { useCallback, useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import CustomDialogHeader from "./CustomDialogHeader";
import { Layers2Icon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createWorkflowSchema, CreateWorkflowSchemaType } from "@/schema/workflow";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { createWorkflow } from "@/actions/workflows/createWorkflow";
import { toast } from "sonner";

interface Props {
	triggerText?: string;
}

export default function CreateWorkflowDialog({ triggerText }: Props) {
	const [open, setOpen] = useState(false)

	const form = useForm<CreateWorkflowSchemaType>({
		resolver: zodResolver(createWorkflowSchema),
		defaultValues: { name: "", description: "" }
	})

	const { mutate, isPending } = useMutation({
		mutationFn: createWorkflow,
		onSuccess: () => {
			toast.success("Workflow created", { id: "create-workflow" })
		},
		onError: () => {
			toast.error("Failed to create workflow", { id: "create-workflow" })
		}
	})

	const onSubmit = useCallback((values: CreateWorkflowSchemaType) => {
		toast.loading("Creating workflow...", { id: "create-workflow" })
		mutate(values)
	}, [mutate])

	return <Dialog open={open} onOpenChange={(open) => {
		form.reset();
		setOpen(open)
	}}>
		<DialogTrigger asChild>
			<Button>{triggerText ?? "Create Workflow"}</Button>
		</DialogTrigger>
		<DialogContent className="px-0">
			<CustomDialogHeader
				icon={Layers2Icon}
				title="Create Workflow"
				subTitle="Start building your workflow"
			/>
			<div className="p-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="sample" {...field} />
									</FormControl>
									<FormDescription>This is your workflow name.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea placeholder="sample description" {...field} />
									</FormControl>
									<FormDescription>This is your workflow descripton.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full" disabled={isPending}>{
							!isPending ? "Proceed" : <Loader2 className="animate-spin" />
						}</Button>
					</form>
				</Form>
			</div>
		</DialogContent>
	</Dialog>
}
