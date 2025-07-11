"use client"

import { getWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases"
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow"
import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { CalendarIcon, CircleDashedIcon, ClockIcon, CoinsIcon, Loader, LucideIcon, WorkflowIcon } from "lucide-react"
import { ReactNode, useEffect, useState } from "react"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { datesToDurationString } from "@/lib/helper/datesToDurationString"
import { getPhasesTotalCost } from "@/lib/helper/phases"
import { getWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { ExecutionLog } from "@/lib/generated/prisma"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { cn } from "@/lib/utils"
import { LogLevel } from "@/types/log"
import PhaseStatusBadge from "./PhaseStatusBadge"
import ViewResponse from "./ViewResponse"
import { TabsContent, TabsList, TabsTrigger, Tabs } from "../ui/tabs"
import ViewPreview from "./previews/ViewPreview"

type ExecutionData = Awaited<ReturnType<typeof getWorkflowExecutionWithPhases>>

interface Props {
	initialData: ExecutionData
}

export default function ExecutionViewer({ initialData }: Props) {
	const [selectedPhase, setSelectedPhase] = useState<string | null>(null)
	const [preview, setPreview] = useState(false)

	const { data, isLoading, isSuccess } = useQuery({
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

	useEffect(() => {
		if (isSuccess && data) {
			const lastPhase = data.phases[data.phases.length - 1]
			setSelectedPhase(lastPhase.id)
		}
	}, [isSuccess, data])

	{/*

	useEffect(() => {
		const phases = data?.phases || []
		if (isRunning) {
			const phaseToSelect = phases.toSorted((a, b) => a.startedAt! > b.startedAt! ? -1 : 1)[0]
			//setSelectedPhase(phaseToSelect.id)
			return;
		}

		const phaseToSelect = phases.toSorted((a, b) => a.completedAt! > b.completedAt! ? -1 : 1)[0]
		setSelectedPhase(phaseToSelect.id)
	}, [data?.phases, isRunning, setSelectedPhase])
*/}

	const duration = datesToDurationString(data?.completedAt, data?.startedAt)

	const creditsConsumed = getPhasesTotalCost(data?.phases || [])

	console.log("@@PHASEDETAILS", phaseDetails)
	console.log("@@SELECTEDPHASE", selectedPhase)
	if (preview && phaseDetails.data?.outputs) return <ViewPreview setPreview={setPreview} outputs={phaseDetails.data.outputs} />

	return <div className="w-full h-[calc(100vh_-_110px)]">
		<div className="w-full h-[50px]  flex gap-5 justify-between pr-10 border-b-[1px] border-gray-300">

			<div className="flex gap-5">
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
			</div>
			<Button onClick={() => setPreview(true)} className="bg-green-500 hover:bg-green-600">
				See Preview
			</Button>
			{/*
				<ExecutionLabel
					icon={CoinsIcon}
					label="Credits consumed"
					value={creditsConsumed}
				/>
				*/}
		</div>
		<div className="w-full h-full flex">

			<aside className="w-[300px] min-w-[300px] max-w-[300px] border-r-2 border-seperate flex flex-grow flex-col overflow-hidden">
				<div className="flex justify-center items-center py-2 px-4">
					<div className="text-muted-foreground flex items-center gap-2">
						<WorkflowIcon size={20} className="stroke-muted-foreground" />
						<span className="font-semibold">Phases</span>
					</div>
				</div>
				<Separator />
				<div className="overflow-auto h-full px-2 py-4 flex flex-col gap-1">
					{data?.phases.map((phase, i) => (
						<Button key={phase.id} className="w-full justify-between bg-gray-100 hover:bg-gray-200 text-black"
							onClick={() => {
								//if (isRunning) return;
								setSelectedPhase(phase.id)
							}}
						>
							<div className="flex items-center gap-2">
								<Badge variant="outline" className=""
									style={{ color: selectedPhase === phase.id ? "#22c55e" : "" }}
								>{i + 1}</Badge>
								<p className="font-semibold " style={{ color: selectedPhase === phase.id ? "#22c55e" : "" }}>{phase.name}</p>
							</div>
							<PhaseStatusBadge status={phase.status as ExecutionPhaseStatus} />
						</Button>
					))}
				</div>
			</aside>
			<div className="flex w-full h-full px-5">
				{/*
					{isRunning && (
				<div className="flex items-center flex-col gap-2 justify-center h-full w-full">
					<p className="font-bold">Run is in Progress</p>
				</div>
			)}
			{!isRunning && !selectedPhase && (
				<div className="flex items-center flex-col gap-2 justify-center h-full w-full">
					<div className="flex flex-col gap-1 text-center">
						<p className="font-bold">No phase selected</p>
						<p className="text-sm text-muted-foreground">
							Select a phase to view Details
						</p>
					</div>
				</div>
			)}

		*/}
				{selectedPhase && phaseDetails.data && (
					<div className="flex flex-col pb-4 container gap-4 overflow-auto">
						<div className="flex gap-2 py-2 items-center">
							{/*
						<Badge variant="outline" className="space-x-4">
							<div className="flex gap-1 items-center">
								<CoinsIcon size={18} className="stroke-muted-foreground" />
								<span>Credits</span>
								<span>TODO</span>

							</div>
						</Badge>
						*/}
							<Badge variant="outline" className="space-x-4">
								<div className="flex gap-1 items-center">
									<ClockIcon size={18} className="stroke-muted-foreground" />
									<span>Duration</span>
									<span>{datesToDurationString(phaseDetails.data.completedAt, phaseDetails.data.startedAt) || "-"}</span>

								</div>
							</Badge>
						</div>
						<Tabs defaultValue="inputs" className="w-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="inputs">Inputs</TabsTrigger>
								<TabsTrigger value="outputs">Outputs</TabsTrigger>
								<TabsTrigger value="logs">Logs</TabsTrigger>
							</TabsList>
							<TabsContent value="inputs">

								<ParameterViewer
									type="input"
									title="Inputs"
									subTitle="Inputs used for this phase"
									paramJSON={phaseDetails.data.inputs}
								/>
							</TabsContent>
							<TabsContent value="outputs">

								<ParameterViewer
									type="output"
									title="Outputs"
									subTitle="Outputs used for this phase"
									paramJSON={phaseDetails.data.outputs}
								/>
							</TabsContent>
							<TabsContent value="logs">

								<LogViewer
									logs={phaseDetails.data.logs}
								/>
							</TabsContent>
						</Tabs>
					</div>
				)}

			</div>
		</div>
	</div>
}


function ExecutionLabel({ icon, label, value }: { icon: LucideIcon; label: ReactNode; value: ReactNode }) {
	const Icon = icon
	return (
		<div className="text-sm flex justify-between gap-3 items-center py-2 px-4">
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

function ParameterViewer({ title, subTitle, paramJSON, type }: { type: "input" | "output"; title: string; subTitle: string; paramJSON: string | null }) {
	const params = paramJSON ? JSON.parse(paramJSON) : undefined
	return <Card>
		<CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
			<CardTitle className="text-base">{title}</CardTitle>
			<CardDescription className="text-muted-foreground text-sm">
				{subTitle}
			</CardDescription>
		</CardHeader>
		<CardContent className="py-4">
			<div className="flex flex-col gap-2">
				{!params || Object.keys(params).length === 0 && (
					<p className="text-sm">
						No parameters generated by this phase
					</p>
				)}
				{params && Object.entries(params).map(([key, value]) => (
					<div className="flex justify-between items-center space-y-1" key={key}>
						<p className="text-sm text-muted-foreground flex-1 basis-1/3">{key}</p>
						<div className="flex gap-2 items-center flex-1 basis-2/3">
							<Input readOnly className="" value={value as string} />
							<ViewResponse name={key} type={type} response={value as string} />
						</div>
					</div>
				))}
			</div>
		</CardContent>
	</Card>
}

function LogViewer({ logs }: { logs: ExecutionLog[] | undefined }) {
	if (!logs || logs.length === 0) return null;
	return <Card>
		<CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
			<CardTitle className="text-base">logs</CardTitle>
			<CardDescription className="text-muted-foreground text-sm">
				Logs generated by this phase
			</CardDescription>
		</CardHeader>
		<CardContent className="p-0">
			<Table>
				<TableHeader className="text-muted-foreground text-sm">
					<TableRow>
						<TableHead>Time</TableHead>
						<TableHead>Level</TableHead>
						<TableHead>Message</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{logs.map((log) => (
						<TableRow key={log.id} className="text-muted-foreground">
							<TableCell width={190} className="text-xs text-muted-foreground p-[2px] pl-4">{log.timestamp.toISOString()}</TableCell>
							<TableCell width={80} className={cn("uppercase text-xs font-bold p-[3px] pl-4",
								(log.logLevel as LogLevel) === "error" && "text-destructive",
								(log.logLevel as LogLevel) === "info" && "text-primary",

							)}>{log.logLevel}</TableCell>
							<TableCell className="text-sm flex-1 p-[3px] pl-4">{log.message}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</CardContent>
	</Card>
}
