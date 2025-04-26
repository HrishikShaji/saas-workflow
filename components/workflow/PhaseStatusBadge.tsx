import { ExecutionPhaseStatus } from "@/types/workflow"
import { CircleCheckIcon, CircleDashedIcon, CircleXIcon, LoaderIcon } from "lucide-react";

interface Props {
	status: ExecutionPhaseStatus;
}

export default function PhaseStatusBadge({ status }: Props) {
	switch (status) {
		case ExecutionPhaseStatus.PENDING:
			return <CircleDashedIcon size={20} className="stroke-muted-foreground" />
		case ExecutionPhaseStatus.RUNNING:
			return <LoaderIcon size={20} className="animate-spin stroke-muted-foreground" />
		case ExecutionPhaseStatus.FAILED:
			return <CircleXIcon size={20} className="stroke-destructive" />
		case ExecutionPhaseStatus.COMPLETED:
			return <CircleCheckIcon size={20} className="stroke-green-500" />
		default:
			return <div className="rounded-full">{status}</div>
	}
}
