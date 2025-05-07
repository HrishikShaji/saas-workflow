"use client"

import { TaskType } from "@/types/task"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Button } from "../ui/button"
import { TaskRegistry } from "@/lib/workflow/task/registry"

export default function TaskMenu() {
	return <aside className="w-[250px]  min-w-[250px] max-w-[250px]  bg-white border-separate h-full p-2 px-4 overflow-auto">
		<Accordion type="multiple" className="w-full" defaultValue={["ai"]}>
			<AccordionItem value="ai">
				<AccordionTrigger className="font-bold">
					AI Agents
				</AccordionTrigger>
				<AccordionContent className="flex flex-col gap-1">
					<TaskMenuBtn taskType={TaskType.PROMPT_GENERATOR} />
					<TaskMenuBtn taskType={TaskType.DRAFT_GENERATOR} />
					<TaskMenuBtn taskType={TaskType.CLARITY_AGENT} />
					<TaskMenuBtn taskType={TaskType.COMPLIANCE_AGENT} />
					<TaskMenuBtn taskType={TaskType.TONE_AGENT} />
					<TaskMenuBtn taskType={TaskType.RISK_REVIEW_AGENT} />
					<TaskMenuBtn taskType={TaskType.POLISHER_AGENT} />
					<TaskMenuBtn taskType={TaskType.OPTIONS_AGENT} />
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="database">
				<AccordionTrigger className="font-bold">
					Database
				</AccordionTrigger>
				<AccordionContent className="flex flex-col gap-1">
					<TaskMenuBtn taskType={TaskType.DATABASE_CONNECTOR} />
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="extraction">
				<AccordionTrigger className="font-bold">
					Data extraction
				</AccordionTrigger>
				<AccordionContent className="flex flex-col gap-1">
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
			className="flex justify-start items-center gap-2 border w-full "
			draggable
			onDragStart={(e) => onDragStart(e, taskType)}
		>
			<task.icon className="text-black" size={20} />
			<span className="w-full truncate text-ellipsis text-left">{task.label}</span>
		</Button>
	)
}
