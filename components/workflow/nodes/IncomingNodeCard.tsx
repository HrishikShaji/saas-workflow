import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode, AppNodeData } from "@/types/appNode";
import { getIncomers, Node, useReactFlow } from "@xyflow/react";
import { JsonEditor } from "json-edit-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Editor from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface Props {
	node: Node;
	updateNodeParamValue: (value: string) => void;
	currentNodeId: string;
	updateCustomInputs: (value: string) => void;
}

export default function IncomingNodeCard({ node, updateNodeParamValue, currentNodeId, updateCustomInputs }: Props) {
	const { theme } = useTheme();
	const nodeData = node.data as AppNodeData;
	const nodeType = TaskRegistry[nodeData.type];
	const [editorData, setEditorData] = useState(null);
	const [variables, setVariables] = useState<{ name: string; path: string; value: any }[]>([]);
	const [selectedField, setSelectedField] = useState("");
	const [customInputs, setCustomInputs] = useState({})
	const [customName, setCustomName] = useState("");
	const { getNode } = useReactFlow()
	const currentNode = getNode(currentNodeId) as Node<AppNodeData>
	const currentNodeType = TaskRegistry[currentNode.data.type]
	const [code, setCode] = useState(`// Write your code here
// Access variables directly by their names
// Example:
// const result = myVariable + " processed";
// return result;`);
	const [output, setOutput] = useState("");

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

	const handleEditorWillMount = (monaco: Monaco) => {
		// Register custom variable types for IntelliSense
		if (variables.length > 0) {
			const typeDeclarations = variables.map(v =>
				`declare const ${v.name}: ${getTypeDeclaration(v.value)};`
			).join('\n');

			monaco.languages.typescript.javascriptDefaults.addExtraLib(
				typeDeclarations,
				'variables.d.ts'
			);
		}
	};

	const getTypeDeclaration = (value: any): string => {
		if (value === null) return 'null';
		if (Array.isArray(value)) return 'any[]';
		switch (typeof value) {
			case 'string': return 'string';
			case 'number': return 'number';
			case 'boolean': return 'boolean';
			case 'object': return 'Record<string, any>';
			default: return 'any';
		}
	};

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

	const handleAddVariable = (inputName: string) => {
		if (!selectedField || !inputName) return;

		const value = getValueFromPath(editorData, selectedField);
		setVariables(prev => [
			...prev,
			{
				name: inputName,
				path: selectedField,
				value
			}
		]);
		//setCustomName("");
		setCustomInputs(prev => ({ ...prev, [inputName]: selectedField }))
		setSelectedField("");
	};

	const getValueFromPath = (obj: any, path: string) => {
		return path.split(".").reduce((o, p) => o?.[p], obj);
	};

	const handleRemoveVariable = (index: number) => {
		setVariables(prev => prev.filter((_, i) => i !== index));
	};

	const executeCode = () => {
		try {
			// Create a context with the variables
			const context: Record<string, any> = {};
			variables.forEach(variable => {
				context[variable.name] = variable.path;
			});

			// Create a function that takes all variables as parameters
			const argNames = Object.keys(context);
			const argValues = Object.values(context);

			// Wrap the user's code in a function and call it immediately
			const func = new Function(...argNames, `
        try {
          ${code}
        } catch (error) {
          return { error: error.message };
        }
      `);

			const result = func(...argValues);

			if (result && result.error) {
				setOutput(`Error: ${result.error}`);
			} else {
				updateNodeParamValue(JSON.stringify(result))
				setOutput(JSON.stringify(result, null, 2) || "Code executed successfully (no return value)");
			}
		} catch (error: any) {
			setOutput(`Error: ${error.message}`);
		}
	};

	function saveCustomInputs() {
		const stringifiedCustomInputs = JSON.stringify(customInputs)
		updateCustomInputs(stringifiedCustomInputs)
	}

	if (!editorData) {
		return <div className="p-4 text-muted-foreground">No incoming schema defined</div>;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{nodeType.label}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 flex flex-col gap-5 h-[60vh] overflow-y-auto">
				<div className="flex gap-5">
					<div className="flex-1">
						<JsonEditor data={editorData} />
					</div>

					<div className="flex-1 space-y-4">
						<div className="flex flex-col gap-2">
							{currentNodeType.inputs.map((input, i) => (

								<div className="flex gap-2" key={i}>
									{/*
									<Input
										placeholder="Variable name"
										value={customName}
										onChange={(e) => setCustomName(e.target.value)}
									/>
									*/}
									<h1 className="w-[200px]">{input.name}</h1>
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

									<Button onClick={() => handleAddVariable(input.name)}>Add Variable</Button>
								</div>
							))}
							<Button onClick={saveCustomInputs}>save custom inputs</Button>
						</div>

						<div>
							<h4 className="text-sm font-medium mb-2">Current Variables:</h4>
							{variables.length === 0 ? (
								<p className="text-muted-foreground">No variables created yet</p>
							) : (
								<div className="space-y-2 max-h-40 overflow-y-auto">
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
					</div>
				</div>

				<div className="grid grid-cols-2 gap-5">
					<div className="space-y-2">
						<h4 className="text-sm font-medium">Code Editor:</h4>
						<div className="border rounded overflow-hidden h-64">
							<Editor
								language="javascript"
								theme={theme === 'dark' ? 'vs-dark' : 'light'}
								value={code}
								onChange={(value) => setCode(value ?? '')}
								beforeMount={handleEditorWillMount}
								options={{
									minimap: { enabled: false },
									fontSize: 14,
									scrollBeyondLastLine: false,
									automaticLayout: true,
									wordWrap: 'on',
									lineNumbers: 'on',
									tabSize: 2,
								}}
							/>
						</div>
						<Button onClick={executeCode}>Run Code</Button>
					</div>

					<div className="space-y-2">
						<h4 className="text-sm font-medium">Output:</h4>
						<div className="border rounded overflow-hidden h-64">
							<Editor
								language="json"
								theme={theme === 'dark' ? 'vs-dark' : 'light'}
								value={output}
								options={{
									readOnly: true,
									minimap: { enabled: false },
									fontSize: 14,
									scrollBeyondLastLine: false,
									automaticLayout: true,
									wordWrap: 'on',
									lineNumbers: 'off',
								}}
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
