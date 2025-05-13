// components/SchemaBuilderForm.tsx
import { useState } from 'react';
import { z } from 'zod';
import { generateZodSchema } from '@/lib/schemaUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';

interface SchemaField {
	name: string;
	type: FieldType;
	description?: string;
	required: boolean;
	rules: {
		min?: number;
		max?: number;
		length?: number;
		pattern?: string;
		email?: boolean;
		url?: boolean;
		uuid?: boolean;
	};
}

export default function SchemaBuilderForm() {
	const [fields, setFields] = useState<SchemaField[]>([
		{
			name: '',
			type: 'string',
			description: '',
			required: true,
			rules: {},
		},
	]);
	const [schemaName, setSchemaName] = useState('');
	const [generatedSchema, setGeneratedSchema] = useState('');

	const addField = () => {
		setFields([
			...fields,
			{
				name: '',
				type: 'string',
				description: '',
				required: true,
				rules: {},
			},
		]);
	};

	const removeField = (index: number) => {
		const newFields = [...fields];
		newFields.splice(index, 1);
		setFields(newFields);
	};

	const updateField = (index: number, field: Partial<SchemaField>) => {
		const newFields = [...fields];
		newFields[index] = { ...newFields[index], ...field };
		setFields(newFields);
	};

	const generateSchema = () => {
		try {
			const schema = generateZodSchema(fields, schemaName);
			setGeneratedSchema(schema);
			toast('Schema generated successfully');
		} catch (error) {
			toast('Error generating schema');
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedSchema);
		toast('Schema copied to clipboard!');
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Build Your Schema</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="schema-name">Schema Name</Label>
						<Input
							id="schema-name"
							type="text"
							value={schemaName}
							onChange={(e) => setSchemaName(e.target.value)}
							placeholder="UserSchema"
						/>
					</div>

					<div className="space-y-4">
						{fields.map((field, index) => (
							<Card key={index}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Field {index + 1}
									</CardTitle>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => removeField(index)}
									>
										Remove
									</Button>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="space-y-2">
											<Label htmlFor={`field-name-${index}`}>Field Name</Label>
											<Input
												id={`field-name-${index}`}
												type="text"
												value={field.name}
												onChange={(e) =>
													updateField(index, { name: e.target.value })
												}
												placeholder="username"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor={`field-type-${index}`}>Type</Label>
											<Select
												value={field.type}
												onValueChange={(value) =>
													updateField(index, { type: value as FieldType })
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select type" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="string">String</SelectItem>
													<SelectItem value="number">Number</SelectItem>
													<SelectItem value="boolean">Boolean</SelectItem>
													<SelectItem value="date">Date</SelectItem>
													<SelectItem value="array">Array</SelectItem>
													<SelectItem value="object">Object</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className="flex items-center space-x-2 pt-7">
											<Checkbox
												id={`field-required-${index}`}
												checked={field.required}
												onCheckedChange={(checked) =>
													updateField(index, { required: !!checked })
												}
											/>
											<Label htmlFor={`field-required-${index}`}>Required</Label>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor={`field-description-${index}`}>
											Description
										</Label>
										<Input
											id={`field-description-${index}`}
											type="text"
											value={field.description || ''}
											onChange={(e) =>
												updateField(index, { description: e.target.value })
											}
											placeholder="User's unique identifier"
										/>
									</div>

									<div className="space-y-4 pt-4">
										<h4 className="text-sm font-medium">Validation Rules</h4>
										{field.type === 'string' && (
											<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
												<div className="space-y-2">
													<Label htmlFor={`field-min-${index}`}>Min Length</Label>
													<Input
														id={`field-min-${index}`}
														type="number"
														min="0"
														value={field.rules.min || ''}
														onChange={(e) =>
															updateField(index, {
																rules: {
																	...field.rules,
																	min: e.target.value
																		? parseInt(e.target.value)
																		: undefined,
																},
															})
														}
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor={`field-max-${index}`}>Max Length</Label>
													<Input
														id={`field-max-${index}`}
														type="number"
														min="1"
														value={field.rules.max || ''}
														onChange={(e) =>
															updateField(index, {
																rules: {
																	...field.rules,
																	max: e.target.value
																		? parseInt(e.target.value)
																		: undefined,
																},
															})
														}
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor={`field-length-${index}`}>
														Exact Length
													</Label>
													<Input
														id={`field-length-${index}`}
														type="number"
														min="1"
														value={field.rules.length || ''}
														onChange={(e) =>
															updateField(index, {
																rules: {
																	...field.rules,
																	length: e.target.value
																		? parseInt(e.target.value)
																		: undefined,
																},
															})
														}
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor={`field-pattern-${index}`}>
														Regex Pattern
													</Label>
													<Input
														id={`field-pattern-${index}`}
														type="text"
														value={field.rules.pattern || ''}
														onChange={(e) =>
															updateField(index, {
																rules: {
																	...field.rules,
																	pattern: e.target.value,
																},
															})
														}
														placeholder="^[a-zA-Z0-9]+$"
													/>
												</div>

												<div className="flex items-center space-x-2">
													<Checkbox
														id={`field-email-${index}`}
														checked={!!field.rules.email}
														onCheckedChange={(checked) =>
															updateField(index, {
																rules: {
																	...field.rules,
																	email: !!checked,
																	pattern: checked
																		? undefined
																		: field.rules.pattern,
																},
															})
														}
													/>
													<Label htmlFor={`field-email-${index}`}>Email</Label>
												</div>

												<div className="flex items-center space-x-2">
													<Checkbox
														id={`field-url-${index}`}
														checked={!!field.rules.url}
														onCheckedChange={(checked) =>
															updateField(index, {
																rules: {
																	...field.rules,
																	url: !!checked,
																	pattern: checked
																		? undefined
																		: field.rules.pattern,
																},
															})
														}
													/>
													<Label htmlFor={`field-url-${index}`}>URL</Label>
												</div>

												<div className="flex items-center space-x-2">
													<Checkbox
														id={`field-uuid-${index}`}
														checked={!!field.rules.uuid}
														onCheckedChange={(checked) =>
															updateField(index, {
																rules: {
																	...field.rules,
																	uuid: !!checked,
																	pattern: checked
																		? undefined
																		: field.rules.pattern,
																},
															})
														}
													/>
													<Label htmlFor={`field-uuid-${index}`}>UUID</Label>
												</div>
											</div>
										)}

										{field.type === 'number' && (
											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor={`field-min-${index}`}>Min Value</Label>
													<Input
														id={`field-min-${index}`}
														type="number"
														value={field.rules.min || ''}
														onChange={(e) =>
															updateField(index, {
																rules: {
																	...field.rules,
																	min: e.target.value
																		? parseInt(e.target.value)
																		: undefined,
																},
															})
														}
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor={`field-max-${index}`}>Max Value</Label>
													<Input
														id={`field-max-${index}`}
														type="number"
														value={field.rules.max || ''}
														onChange={(e) =>
															updateField(index, {
																rules: {
																	...field.rules,
																	max: e.target.value
																		? parseInt(e.target.value)
																		: undefined,
																},
															})
														}
													/>
												</div>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					<div className="flex gap-2">
						<Button onClick={addField} variant="secondary">
							Add Field
						</Button>
						<Button onClick={generateSchema}>Generate Schema</Button>
					</div>
				</CardContent>
			</Card>

			{generatedSchema && (
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Generated Zod Schema</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							onClick={copyToClipboard}
							className="h-8 w-8"
						>
							<Copy className="h-4 w-4" />
						</Button>
					</CardHeader>
					<CardContent>
						<pre className="relative rounded bg-muted p-4 font-mono text-sm">
							{generatedSchema}
						</pre>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
