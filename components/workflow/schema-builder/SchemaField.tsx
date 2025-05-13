import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { SchemaField as SchemaFieldType, FieldType } from '@/types/schema';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ValidationRules } from './ValidationRules';

interface SchemaFieldProps {
	field: SchemaFieldType;
	index: number;
	onChange: (field: SchemaFieldType) => void;
	onRemove: () => void;
	hideRemove?: boolean;
}

export function SchemaField({ field, index, onChange, onRemove, hideRemove }: SchemaFieldProps) {
	const [expanded, setExpanded] = useState(true);

	const updateField = (updates: Partial<SchemaFieldType>) => {
		onChange({ ...field, ...updates });
	};

	return (
		<div className="border rounded-md overflow-hidden mb-2">
			<div className="bg-gray-50 p-2 flex items-center justify-between">
				<div className="flex items-center">
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0"
						onClick={() => setExpanded(!expanded)}
					>
						{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
					</Button>
					<span className="font-medium text-sm">
						{field.name ? field.name : `New Field`}
					</span>
					<span className="ml-2 text-xs text-gray-500">
						{field.type}
					</span>
				</div>
				{!hideRemove && (
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0"
						onClick={onRemove}
					>
						<X size={16} />
					</Button>
				)}
			</div>

			{expanded && (
				<div className="p-3 space-y-3">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
						<div>
							<Label htmlFor={`field-name-${index}`} className="text-xs">Name</Label>
							<Input
								id={`field-name-${index}`}
								value={field.name}
								onChange={(e) => updateField({ name: e.target.value })}
								placeholder="username"
								className="h-8"
							/>
						</div>

						<div>
							<Label htmlFor={`field-type-${index}`} className="text-xs">Type</Label>
							<Select
								value={field.type}
								onValueChange={(value) => updateField({ type: value as FieldType })}
							>
								<SelectTrigger id={`field-type-${index}`} className="h-8">
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

						<div>
							<Label htmlFor={`field-description-${index}`} className="text-xs">Description</Label>
							<Input
								id={`field-description-${index}`}
								value={field.description || ''}
								onChange={(e) => updateField({ description: e.target.value })}
								placeholder="User's identifier"
								className="h-8"
							/>
						</div>

						<div className="flex items-end pb-1">
							<div className="flex items-center space-x-2">
								<Checkbox
									id={`field-required-${index}`}
									checked={field.required}
									onCheckedChange={(checked) => updateField({ required: !!checked })}
								/>
								<Label
									htmlFor={`field-required-${index}`}
									className="text-xs cursor-pointer"
								>
									Required
								</Label>
							</div>
						</div>
					</div>

					{(field.type === 'string' || field.type === 'number') && (
						<div className="pt-1">
							<Label className="text-xs font-medium mb-2 block">Validation Rules</Label>
							<ValidationRules
								type={field.type}
								rules={field.rules}
								onChange={(rules) => updateField({ rules })}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
