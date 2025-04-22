import { CheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useReactFlow } from "@xyflow/react";

interface Props {
	workflowId: string;
}

export default function SaveButton({ workflowId }: Props) {
	const { toObject } = useReactFlow()
	return <Button variant="outline" className="flex items-center gap-2" onClick={() => { alert("TODO"); console.log("@data", toObject()) }
	}>
		<CheckIcon size={16} className="stroke-green-500" />
	</Button >
}
