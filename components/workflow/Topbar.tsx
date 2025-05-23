"use client"

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import TooltipWrapper from "./TooltipWrapper";
import { ChevronLeft } from "lucide-react";
import SaveButton from "./SaveButton";
import ExecuteButton from "./ExecuteButton";
import ExperimentalExecuteButton from "./ExperimentalExecutionButton";

interface Props {
	title: string;
	workflowId: string;
	subTitle?: string;
	hideButtons?: boolean
}

export default function Topbar({ workflowId, title, subTitle, hideButtons = false }: Props) {
	const router = useRouter()
	return <header className="flex p-2 border-p-2 border-separate bg-white justify-between w-full h-[60px] sticky top-0 z-10">
		<div className="flex gap-1 flex-1">
			<TooltipWrapper content="Back">
				<Button variant="ghost" size="icon"
					onClick={() => router.back()}
				>
					<ChevronLeft size={20} />
				</Button>
			</TooltipWrapper>
			<div>
				<p className="font-bold text-ellipsis truncate">{title}</p>
				{subTitle && <p className="text-xs text-muted-foreground truncate text-ellipsis">{subTitle}</p>}
			</div>
		</div>
		<div className="flex gap-1 flex-1 justify-end">
			{hideButtons === false && (
				<>
					<ExperimentalExecuteButton workflowId={workflowId} />
					<ExecuteButton workflowId={workflowId} />
					<SaveButton workflowId={workflowId} />
				</>
			)}
		</div>
	</header>
}
