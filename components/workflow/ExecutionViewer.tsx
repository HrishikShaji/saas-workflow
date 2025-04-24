"use client"

import { getWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases"
import { WorkflowExecutionStatus } from "@/types/workflow"
import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { CalendarIcon, CircleDashedIcon, ClockIcon, CoinsIcon, Loader, LucideIcon, WorkflowIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { datesToDurationString } from "@/lib/helper/datesToDurationString"
import { getPhasesTotalCost } from "@/lib/helper/phases"
import { getWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails"

type ExecutionData = Awaited<ReturnType<typeof getWorkflowExecutionWithPhases>>

interface Props {
	initialData: ExecutionData
}

export default function ExecutionViewer({ initialData }: Props) {
	const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

	const { data, isLoading } = useQuery({
		queryKey: ["execution", initialData?.id],
		initialData,
		queryFn: () => getWorkflowExecutionWithPhases(initialData!.id),
		refetchInterval: (q) => q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false
	})

	const phaseDetails = useQuery({
		queryKey: ["phaseDetails", selectedPhase],
		enabled: selectedPhase !== null,
		queryFn: () => getWorkflowPhaseDetails(selectedPhase!)
	})

	const isRunning = data?.status === WorkflowExecutionStatus.RUNNING

	const duration = datesToDurationString(data?.completedAt, data?.startedAt)

	const creditsConsumed = getPhasesTotalCost(data?.phases || [])

	return <div className="flex w-full h-full">
		<aside className="w-[300px] min-w-[300px] max-w-[300px] border-r-2 border-seperate flex flex-grow flex-col overflow-hidden">
			<div className="py-4 px-2">
				<ExecutionLabel
					icon={CircleDashedIcon}
					label="Status"
					value={data?.status}
				/>
				<ExecutionLabel
					icon={CalendarIcon}
					label="Started at"
					value={data?.startedAt ? formatDistanceToNow(new Date(data.startedAt), { addSuffix: true }) : "-"}
				/>
				<ExecutionLabel
					icon={ClockIcon}
					label="Duration"
					value={duration ? duration : <Loader className="animate-spin " size={20} />}
				/>
				<ExecutionLabel
					icon={CoinsIcon}
					label="Credits consumed"
					value={creditsConsumed}
				/>
			</div>
			<Separator />
			<div className="flex justify-center items-center py-2 px-4">
				<div className="text-muted-foreground flex items-center gap-2">
					<WorkflowIcon size={20} className="stroke-muted-foreground" />
					<span className="font-semibold">Phases</span>
				</div>
			</div>
			<Separator />
			<div className="overflow-auto h-full px-2 py-4 flex flex-col gap-1">
				{data?.phases.map((phase, i) => (
					<Button key={phase.id} className="w-full justify-between"
						onClick={() => {
							if (isRunning) return;
							setSelectedPhase(phase.id)
						}}
						style={{ background: selectedPhase === phase.id ? "blue" : "" }}
					>
						<div className="flex items-center gap-2">
							<Badge variant="outline" className="text-white">{i + 1}</Badge>
							<p className="font-semibold text-white">{phase.name}</p>
						</div>
						<p className="text-xs text-muted-foreground">{phase.status}</p>
					</Button>
				))}
			</div>
		</aside>
		<div className="flex w-full h-full">
			<pre>{JSON.stringify(phaseDetails.data, null, 4)}</pre>
		</div>
	</div>
}


function ExecutionLabel({ icon, label, value }: { icon: LucideIcon; label: ReactNode; value: ReactNode }) {
	const Icon = icon
	return (
		<div className="text-sm flex justify-between items-center py-2 px-4">
			<div className="text-muted-foreground flex items-center gap-2">
				<Icon size={20} className="stroke-muted-foreground/80" />
				<span>{label}</span>
			</div>
			<div className="font-semibold lowercase flex gap-2 items-center">
				{value}
			</div>
		</div>

	)
}
