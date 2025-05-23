import { PlayIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

interface Props {
	workflowId: string;
}

export default function ExperimentalExecuteButton({ workflowId }: Props) {

	const { getNodes, getEdges } = useReactFlow()

	function execute() {

		const nodes = getNodes()
		const edges = getEdges()


		console.log("@@NODES", nodes)
		console.log("@@EDGES", edges)

	}

	return <Button
		onClick={execute}
		variant="outline" className=" flex items-center gap-2">
		<PlayIcon size={16} className="stroke-orange-500" />
		Experimental
	</Button>
}
