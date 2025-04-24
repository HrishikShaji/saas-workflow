import { PlayIcon } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
	workflowId: string;
}

export default function ExecuteButton({ workflowId }: Props) {
	return <Button variant="outline" className="flex items-center gap-2">
		<PlayIcon size={16} className="stroke-orange-500" />
		Execute
	</Button>
}
