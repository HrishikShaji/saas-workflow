import { PlayIcon } from "lucide-react";
import { Button } from "../ui/button";
import useExecutionPlan from "../hooks/useExecutionPlan";

interface Props {
	workflowId: string;
}

export default function ExecuteButton({ workflowId }: Props) {
	const generate = useExecutionPlan()
	return <Button
		onClick={() => {
			const plan = generate();
			console.table(plan)
			console.log("this is plan", plan)
		}}
		variant="outline" className="flex items-center gap-2">
		<PlayIcon size={16} className="stroke-orange-500" />
		Execute
	</Button>
}
