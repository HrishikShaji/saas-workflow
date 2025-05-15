
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
import { WorkflowTask } from "@/types/workflow"
import { Settings } from "lucide-react"
import NodeSettingsParamField from "./NodeSettingsParamField"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SchemaBuilderForm from "../schema-builder/SchemaBuilderForm"
import NodeIncomingVariables from "./NodeIncomingVariables"

interface Props {
	task: WorkflowTask;
	nodeId: string;
}

export default function NodeSettings({ task, nodeId }: Props) {

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
			<DialogContent className="sm:max-w-[1025px]">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>
						Make changes to your Node settings.
					</DialogDescription>
				</DialogHeader>
				<Tabs defaultValue="configuration" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="configuration">Configuration</TabsTrigger>
						<TabsTrigger value="schema">Schema</TabsTrigger>
						<TabsTrigger value="incoming-variables">Incoming Variables</TabsTrigger>
					</TabsList>
					<TabsContent value="configuration">
						<div className="grid gap-4">
							{task.settings.map((input, i) => (
								<NodeSettingsParamField
									key={i}
									param={input}
									disabled={false}
									nodeId={nodeId}
								/>
							))}
						</div>
					</TabsContent>
					<TabsContent value="schema">
						<div>
							<SchemaBuilderForm
								param={task.settings.find((item) => item.name === "Schema") as any}
								disabled={false}
								nodeId={nodeId}

							/>
						</div>
					</TabsContent>
					<TabsContent value="incoming-variables">
						<div>
							<NodeIncomingVariables nodeId={nodeId} />
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}
