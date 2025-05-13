import { ChangeEvent } from 'react';
import { FieldType, ValidationRules as ValidationRulesType } from '@/types/schema';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface ValidationRulesProps {
	type: FieldType;
	rules: ValidationRulesType;
	onChange: (rules: ValidationRulesType) => void;
}

export function ValidationRulesComponent({ type, rules, onChange }: ValidationRulesProps) {
	const handleNumberChange = (e: ChangeEvent<HTMLInputElement>, key: keyof ValidationRulesType) => {
		const value = e.target.value ? parseInt(e.target.value) : undefined;
		onChange({ ...rules, [key]: value });
	};

	const handleCheckboxChange = (checked: boolean | 'indeterminate', key: keyof ValidationRulesType) => {
		// When one checkbox is checked, uncheck others that might conflict
		const newRules = { ...rules };

		if (key === 'email' && checked) {
			newRules.url = false;
			newRules.uuid = false;
			newRules.pattern = undefined;
		} else if (key === 'url' && checked) {
			newRules.email = false;
			newRules.uuid = false;
			newRules.pattern = undefined;
		} else if (key === 'uuid' && checked) {
			newRules.email = false;
			newRules.url = false;
			newRules.pattern = undefined;
		}

		//@ts-ignore
		newRules[key] = !!checked;
		onChange(newRules);
	};

	const handlePatternChange = (e: ChangeEvent<HTMLInputElement>) => {
		const pattern = e.target.value || undefined;
		// If pattern is set, disable other format validators
		onChange({
			...rules,
			pattern,
			...(pattern ? { email: false, url: false, uuid: false } : {})
		});
	};

	if (type === 'string') {
		return (
			<div className="space-y-3">
				<div className="grid grid-cols-2 gap-2">
					<div>
						<Label htmlFor="min" className="text-xs">Min Length</Label>
						<Input
							id="min"
							type="number"
							min="0"
							value={rules.min ?? ''}
							onChange={(e) => handleNumberChange(e, 'min')}
							className="h-8"
						/>
					</div>
					<div>
						<Label htmlFor="max" className="text-xs">Max Length</Label>
						<Input
							id="max"
							type="number"
							min="0"
							value={rules.max ?? ''}
							onChange={(e) => handleNumberChange(e, 'max')}
							className="h-8"
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2">
					<div>
						<Label htmlFor="length" className="text-xs">Exact Length</Label>
						<Input
							id="length"
							type="number"
							min="0"
							value={rules.length ?? ''}
							onChange={(e) => handleNumberChange(e, 'length')}
							className="h-8"
						/>
					</div>
					<div>
						<Label htmlFor="pattern" className="text-xs">Regex Pattern</Label>
						<Input
							id="pattern"
							type="text"
							value={rules.pattern ?? ''}
							onChange={handlePatternChange}
							className="h-8"
							placeholder="^[a-z]+$"
						/>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-2">
					<div className="flex items-center space-x-2">
						<Checkbox
							id="email"
							checked={!!rules.email}
							onCheckedChange={(checked) => handleCheckboxChange(checked, 'email')}
						/>
						<Label htmlFor="email" className="text-xs cursor-pointer">Email</Label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="url"
							checked={!!rules.url}
							onCheckedChange={(checked) => handleCheckboxChange(checked, 'url')}
						/>
						<Label htmlFor="url" className="text-xs cursor-pointer">URL</Label>
					</div>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="uuid"
							checked={!!rules.uuid}
							onCheckedChange={(checked) => handleCheckboxChange(checked, 'uuid')}
						/>
						<Label htmlFor="uuid" className="text-xs cursor-pointer">UUID</Label>
					</div>
				</div>
			</div>
		);
	}

	if (type === 'number') {
		return (
			<div className="grid grid-cols-2 gap-2">
				<div>
					<Label htmlFor="min" className="text-xs">Min Value</Label>
					<Input
						id="min"
						type="number"
						value={rules.min ?? ''}
						onChange={(e) => handleNumberChange(e, 'min')}
						className="h-8"
					/>
				</div>
				<div>
					<Label htmlFor="max" className="text-xs">Max Value</Label>
					<Input
						id="max"
						type="number"
						value={rules.max ?? ''}
						onChange={(e) => handleNumberChange(e, 'max')}
						className="h-8"
					/>
				</div>
			</div>
		);
	}

	return null;
}

export { ValidationRulesComponent as ValidationRules };
