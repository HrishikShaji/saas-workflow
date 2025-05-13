import { useState } from 'react';
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

export function SchemaBuilderForm() {
	const [fields, setFields] = useState<SchemaFieldType[]>([]);
	const [newField, setNewField] = useState<SchemaFieldType>({
		name: '',
		type: 'string',
		description: '',
		required: true,
		rules: {},
	});
	const [schemaName, setSchemaName] = useState('');
	const [generatedSchema, setGeneratedSchema] = useState('');
	const [activeTab, setActiveTab] = useState('add');

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

			const schema = generateZodSchema(fields, schemaName);
			setGeneratedSchema(schema);
			setActiveTab('schema');
			toast('Schema generated successfully');
		} catch (error) {
			toast('Error generating schema', {
				description: error instanceof Error ? error.message : 'Unknown error occurred',
			});
		}
	};

	return (
		<div className="w-full max-h-[70vh]">
			<div className="mb-4">
				<Label htmlFor="schema-name" className="text-sm font-medium">
					Schema Name
				</Label>
				<Input
					id="schema-name"
					value={schemaName}
					onChange={(e) => setSchemaName(e.target.value)}
					placeholder="UserSchema"
					className="mt-1"
				/>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid grid-cols-3 mb-4">
					<TabsTrigger value="add">Add Field</TabsTrigger>
					<TabsTrigger value="fields">Fields ({fields.length})</TabsTrigger>
					<TabsTrigger value="schema">Generated Schema</TabsTrigger>
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
								No fields added yet. Go to "Add Field" tab to create your first field.
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
					<ScrollArea className="h-[calc(60vh-80px)]">
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
			</Tabs>
		</div>
	);
}

export default SchemaBuilderForm;
