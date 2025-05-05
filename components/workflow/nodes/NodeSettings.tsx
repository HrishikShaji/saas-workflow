
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WorkflowTask } from "@/types/workflow"
import { Settings } from "lucide-react"

interface Props {
	task: WorkflowTask;
	nodeId: string;
}

export default function NodeSettings({ task, nodeId }: Props) {

	console.log("@@TASK", task)
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
				>
					<Settings size={20} />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>
						Make changes to your Node settings.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					{task.settings.map((input) => (
						<div key={input.name} className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								{input.name}
							</Label>
							<Input id="name" value={input.value} className="col-span-3" />
						</div>
					))}
				</div>
				<DialogFooter>
					<Button type="submit">Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
