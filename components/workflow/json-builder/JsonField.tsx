import React, { useState, useEffect } from 'react';
import { JsonFieldProps, JsonFieldType } from './types';
import { Type, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import JsonObjectField from './JsonObjectField';
import JsonArrayField from './JsonArrayField';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const JsonField: React.FC<JsonFieldProps> = ({
	path,
	onUpdate,
	onDelete,
	value,
	isRoot = false
}) => {
	const getFieldType = (): JsonFieldType => {
		if (value === null) return 'null';
		if (Array.isArray(value)) return 'array';
		return typeof value as JsonFieldType;
	};

	const [fieldType, setFieldType] = useState<JsonFieldType>(getFieldType());
	const [fieldValue, setFieldValue] = useState<any>(value);
	const [isExpanded, setIsExpanded] = useState(true);
	const [key, setKey] = useState<string>(path.split('.').pop() || 'root');

	useEffect(() => {
		setFieldType(getFieldType());
		setFieldValue(value);
	}, [value]);

	const handleTypeChange = (newType: JsonFieldType) => {
		let newValue: any;

		switch (newType) {
			case 'string':
				newValue = '';
				break;
			case 'number':
				newValue = 0;
				break;
			case 'boolean':
				newValue = false;
				break;
			case 'array':
				newValue = [];
				break;
			case 'object':
				newValue = {};
				break;
			case 'null':
				newValue = null;
				break;
			default:
				newValue = '';
		}

		setFieldType(newType);
		setFieldValue(newValue);
		onUpdate(path, newValue);
	};

	const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let newValue: any = e.target.value;

		if (fieldType === 'number') {
			newValue = parseFloat(newValue) || 0;
		} else if (fieldType === 'boolean') {
			newValue = e.target.value === 'true';
		}

		setFieldValue(newValue);
		onUpdate(path, newValue);
	};

	const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newKey = e.target.value;
		setKey(newKey);

		const parts = path.split('.');
		const parentPath = parts.slice(0, parts.length - 1).join('.');
		const newPath = parentPath ? `${parentPath}.${newKey}` : newKey;

		onUpdate(path, undefined, newPath);
	};

	const handleToggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const renderFieldValue = () => {
		switch (fieldType) {
			case 'string':
				return (
					<Input
						type="text"
						value={fieldValue || ''}
						onChange={handleValueChange}
						className="w-full"
					/>
				);
			case 'number':
				return (
					<Input
						type="number"
						value={fieldValue}
						onChange={handleValueChange}
						className="w-full"
					/>
				);
			case 'boolean':
				return (
					<Select
						value={String(fieldValue)}
						onValueChange={(val) => {
							setFieldValue(val === 'true');
							onUpdate(path, val === 'true');
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select boolean" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="true">true</SelectItem>
							<SelectItem value="false">false</SelectItem>
						</SelectContent>
					</Select>
				);
			case 'object':
				return (
					<JsonObjectField
						path={path}
						value={fieldValue}
						onUpdate={onUpdate}
						onDelete={onDelete}
						isExpanded={isExpanded}
						onToggleExpand={handleToggleExpand}
					/>
				);
			case 'array':
				return (
					<JsonArrayField
						path={path}
						value={fieldValue}
						onUpdate={onUpdate}
						onDelete={onDelete}
						isExpanded={isExpanded}
						onToggleExpand={handleToggleExpand}
					/>
				);
			case 'null':
				return (
					<div className="flex items-center justify-center h-10 px-4 py-2 text-sm text-muted-foreground border rounded-md bg-muted">
						null
					</div>
				);
			default:
				return null;
		}
	};

	const getTypeVariant = () => {
		switch (fieldType) {
			case 'string': return 'secondary';
			case 'number': return 'outline';
			case 'boolean': return 'destructive';
			case 'object': return 'default';
			case 'array': return 'default';
			case 'null': return 'outline';
			default: return 'outline';
		}
	};

	return (
		<Card className={`mb-4 ${isRoot ? 'border-0 shadow-none' : ''}`}>
			<CardContent className="pt-4">
				<div className="flex flex-col space-y-2">
					<div className="flex items-start gap-2">
						{!isRoot && (
							<>
								<div className="w-[200px]">
									<Label htmlFor={`key-${path}`} className="sr-only">
										Key
									</Label>
									<Input
										id={`key-${path}`}
										type="text"
										value={key}
										onChange={handleKeyChange}
										placeholder="Key name"
									/>
								</div>
								<div className="w-[150px]">
									<Select
										value={fieldType}
										onValueChange={(val) => handleTypeChange(val as JsonFieldType)}
									>
										<SelectTrigger className="w-full">
											<div className="flex items-center gap-2">
												<Type className="h-4 w-4" />
												<SelectValue placeholder="Type" />
											</div>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="string">String</SelectItem>
											<SelectItem value="number">Number</SelectItem>
											<SelectItem value="boolean">Boolean</SelectItem>
											<SelectItem value="object">Object</SelectItem>
											<SelectItem value="array">Array</SelectItem>
											<SelectItem value="null">Null</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</>
						)}
						<div className="flex-1 min-w-0">
							{renderFieldValue()}
						</div>
						{!isRoot && (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => onDelete(path)}
								className="text-muted-foreground hover:text-destructive"
								title="Delete field"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						)}
					</div>
					{!isRoot && (
						<div className="flex justify-end">
							<Badge variant={getTypeVariant()} className="text-xs">
								{fieldType}
							</Badge>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default JsonField;
