import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode, AppNodeData } from "@/types/appNode";
import { getIncomers, Node, useReactFlow } from "@xyflow/react";
import { JsonEditor } from "json-edit-react"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
	node: Node;
}


export default function IncomingNodeCard({ node }: Props) {
	const nodeData = node.data as AppNodeData;
	const nodeType = TaskRegistry[nodeData.type];
	const [editorData, setEditorData] = useState(null);
	const [variables, setVariables] = useState<{ name: string; path: string; value: any }[]>([]);
	const [selectedField, setSelectedField] = useState("");
	const [customName, setCustomName] = useState("");

	useEffect(() => {
		const schema = nodeData.settings["Schema"];
		if (schema) {
			try {
				const parsed = JSON.parse(schema);
				setEditorData(parsed);
			} catch (err) {
				console.error(err);
			}
		}
	}, [node]);

	const getAvailableFields = (data: any, prefix = ""): string[] => {
		if (!data) return [];

		if (typeof data === "object" && !Array.isArray(data)) {
			return Object.entries(data).flatMap(([key, value]) => {
				const fullPath = prefix ? `${prefix}.${key}` : key;
				if (typeof value === "object" && value !== null) {
					return [fullPath, ...getAvailableFields(value, fullPath)];
				}
				return [fullPath];
			});
		}

		return [];
	};

	const availableFields = getAvailableFields(editorData);

	const handleAddVariable = () => {
		if (!selectedField || !customName) return;

		const value = getValueFromPath(editorData, selectedField);
		setVariables(prev => [
			...prev,
			{
				name: customName,
				path: selectedField,
				value
			}
		]);
		setCustomName("");
		setSelectedField("");
	};

	const getValueFromPath = (obj: any, path: string) => {
		return path.split(".").reduce((o, p) => o?.[p], obj);
	};

	const handleRemoveVariable = (index: number) => {
		setVariables(prev => prev.filter((_, i) => i !== index));
	};

	if (!editorData) {
		return <div className="p-4 text-muted-foreground">No incoming schema defined</div>;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{nodeType.label}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 flex gap-5">
				<JsonEditor data={editorData} />

				<CardContent className="space-y-4">
					<div className="flex gap-2">
						<Input
							placeholder="Variable name"
							value={customName}
							onChange={(e) => setCustomName(e.target.value)}
						/>

						<Select value={selectedField} onValueChange={setSelectedField}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select field" />
							</SelectTrigger>
							<SelectContent>
								{availableFields.map(field => (
									<SelectItem key={field} value={field}>{field}</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button onClick={handleAddVariable}>Add Variable</Button>
					</div>

					<div>
						<h4 className="text-sm font-medium mb-2">Current Variables:</h4>
						{variables.length === 0 ? (
							<p className="text-muted-foreground">No variables created yet</p>
						) : (
							<div className="space-y-2">
								{variables.map((variable, index) => (
									<div key={index} className="flex items-center justify-between p-2 border rounded">
										<div>
											<Badge variant="outline" className="mr-2">
												{variable.name}
											</Badge>
											<span className="text-sm text-muted-foreground">
												(from: {variable.path})
											</span>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleRemoveVariable(index)}
										>
											Remove
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
				</CardContent>
			</CardContent>
		</Card>
	);
}
