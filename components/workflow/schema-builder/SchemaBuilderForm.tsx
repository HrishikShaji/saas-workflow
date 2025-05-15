import { useCallback, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneratedSchema } from './GeneratedSchema';
import { generateZodSchema } from '@/lib/schemaUtils';
import { SchemaField as SchemaFieldType } from '@/types/schema';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { SchemaField } from './SchemaField';
import { SettingsParam } from '@/types/settings';
import { useReactFlow } from '@xyflow/react';
import { AppNode } from '@/types/appNode';
import { generateJsonSchema } from '@/lib/generateJsonSchema';
import { parseJsonSchemaToFields } from '@/lib/parseJsonSchemaToFields';
import { JsonEditor } from "json-edit-react"

interface Props {
	param: SettingsParam;
	nodeId: string;
	disabled: boolean;
}
export function SchemaBuilderForm({ param, nodeId, disabled }: Props) {
	const [fields, setFields] = useState<SchemaFieldType[]>([]);
	const [newField, setNewField] = useState<SchemaFieldType>({
		name: '',
		type: 'string',
		description: '',
		required: true,
		rules: {},
	});
	const [generatedSchema, setGeneratedSchema] = useState('');
	const [activeTab, setActiveTab] = useState('add');
	const [editorData, setEditorData] = useState<Record<string, any>>({})

	const { updateNodeData, getNode } = useReactFlow()
	const node = getNode(nodeId) as AppNode

	//console.log(node.data.settings)

	const value = node?.data.settings[param.name] || param.value

	useEffect(() => {
		const values = node.data.settings[param.name]
		const parsedValue = JSON.parse(values)
		setEditorData(parsedValue)
		const parsedFields = parseJsonSchemaToFields(values)
		console.log("@@PARSED", parsedValue)
		setFields(parsedFields)
		setGeneratedSchema(values)

	}, [node.data.settings, param.name])

	//console.log("@@VALUE", value)
	const updateNodeParamValue = useCallback((newValue: string) => {
		//	console.log("this is updated", newValue, "with", param.name)
		updateNodeData(nodeId, {
			settings: {
				...node?.data.settings,
				[param.name]: newValue
			}
		})
	}, [param.name, updateNodeData, node?.data.settings, nodeId])

	const addField = () => {
		if (!newField.name) {
			toast('Field name is required', {
				description: 'Please provide a name for the field before adding it.',
			});
			return;
		}

		setFields([...fields, { ...newField }]);
		setNewField({
			name: '',
			type: 'string',
			description: '',
			required: true,
			rules: {},
		});
		setActiveTab('fields');
		toast('Field added successfully');
	};

	const removeField = (index: number) => {
		const newFields = [...fields];
		newFields.splice(index, 1);
		setFields(newFields);
		toast('Field removed');
	};

	const updateField = (index: number, field: SchemaFieldType) => {
		const newFields = [...fields];
		newFields[index] = field;
		setFields(newFields);
	};

	const generateSchema = () => {
		try {
			if (fields.length === 0) {
				toast('No fields defined', {
					description: 'Please add at least one field before generating the schema.',
				});
				return;
			}

			const jsonSchema = generateJsonSchema(fields)
			setGeneratedSchema(jsonSchema);
			updateNodeParamValue(jsonSchema)
			setActiveTab('schema');
			toast('Schema generated successfully');
		} catch (error) {
			toast('Error generating schema', {
				description: error instanceof Error ? error.message : 'Unknown error occurred',
			});
		}
	};

	function editorSubmit(data: any) {
		console.log("@@EDIT", data)
		//setGeneratedSchema(value)
		//
		try {
			const stringified = JSON.stringify(data.newData)
			const parsed = JSON.parse(stringified)
			setEditorData(data.newData)
			updateNodeParamValue(stringified)
		} catch (err) {
			console.error(err)
			setEditorData(data.currentData)
			toast.error("wrong json format")
		}
	}

	return (
		<div className="w-full max-h-[70vh]">

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid grid-cols-4 mb-4">
					<TabsTrigger value="add">Add Field</TabsTrigger>
					<TabsTrigger value="fields">Fields ({fields.length})</TabsTrigger>
					<TabsTrigger value="schema">Generated Schema</TabsTrigger>
					<TabsTrigger value="editor">Editor</TabsTrigger>
				</TabsList>

				<TabsContent value="add" className="space-y-4">
					<ScrollArea className="h-[calc(50vh-120px)]">
						<SchemaField
							field={newField}
							index={-1}
							onChange={setNewField}
							onRemove={() => { }}
							hideRemove
						/>
					</ScrollArea>

					<div className="flex justify-end pt-3 border-t">
						<Button onClick={addField} size="sm">
							Add Field
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="fields" className="space-y-4">
					<ScrollArea className="h-[calc(50vh-120px)] pr-2 -mr-2">
						{fields.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								{`								No fields added yet. Go to "Add Field" tab to create your first field.`}
							</div>
						) : (
							fields.map((field, index) => (
								<SchemaField
									key={index}
									field={field}
									index={index}
									onChange={(updatedField) => updateField(index, updatedField)}
									onRemove={() => removeField(index)}
								/>
							))
						)}
					</ScrollArea>

					<div className="flex justify-between pt-3 border-t">
						<Button
							onClick={() => setActiveTab('add')}
							size="sm"
							variant="outline"
						>
							Add Another Field
						</Button>
						<Button onClick={generateSchema} size="sm">
							Generate Schema
						</Button>
					</div>
				</TabsContent>

				<TabsContent value="schema">
					<ScrollArea className="h-[calc(50vh-120px)]">
						<GeneratedSchema schema={generatedSchema} />
					</ScrollArea>

					<div className="flex justify-between pt-3 mt-3 border-t">
						<Button
							onClick={() => setActiveTab('fields')}
							size="sm"
							variant="outline"
						>
							Edit Fields
						</Button>
						<Button
							onClick={generateSchema}
							size="sm"
						>
							Regenerate Schema
						</Button>
					</div>
				</TabsContent>
				<TabsContent value='editor'>
					<div>
						<JsonEditor
							data={editorData}
							setData={(data: any) => setEditorData(data)}
							onUpdate={() => console.log("update ran")}
							onEdit={(data) => editorSubmit(data)}
							collapse={true}
							showCollectionCount={true}
							onEditEvent={() => console.log("edit event ran")}
						/>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default SchemaBuilderForm;
