"use client"

import { TaskType } from "@/types/task"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Button } from "../ui/button"
import { TaskRegistry } from "@/lib/workflow/task/registry"

export default function TaskMenu() {
	return <aside className="w-[340px]  min-w-[340px] max-w-[340px] border-r-2 border-black border-separate h-full p-2 px-4 overflow-auto">
		<Accordion type="multiple" className="w-full" defaultValue={["extraction"]}>
			<AccordionItem value="extraction">
				<AccordionTrigger className="font-bold">
					Data extraction
				</AccordionTrigger>
				<AccordionContent className="flex flex-col gap-1">
					<TaskMenuBtn taskType={TaskType.PROMPT_GENERATOR} />
					<TaskMenuBtn taskType={TaskType.DRAFT_GENERATOR} />
					<TaskMenuBtn taskType={TaskType.LAUNCH_BROWSER} />
					<TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
					<TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	</aside>
}

function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
	const task = TaskRegistry[taskType]

	const onDragStart = (e: React.DragEvent, type: TaskType) => {
		e.dataTransfer.setData("application/reactflow", type)
		e.dataTransfer.effectAllowed = "move"
	}

	return (
		<Button
			variant="secondary"
			className="flex justify-between items-center gap-2 border w-full"
			draggable
			onDragStart={(e) => onDragStart(e, taskType)}
		>
			<task.icon size={20} />
			{task.label}
		</Button>
	)
}
