import { Label } from "@/components/ui/label";
import { AppNode, ParamProps } from "@/types/appNode";
import { useEffect, useId, useState } from "react";
import Select from 'react-select';

export default function SelectParam({ param, value, updateNodeParamValue, disabled }: ParamProps) {
	const [internalValue, setInternalValue] = useState<string[]>([]);
	const id = useId();

	useEffect(() => {
		try {
			const parsedValue = value ? JSON.parse(value) : [];
			setInternalValue(Array.isArray(parsedValue) ? parsedValue : []);
		} catch {
			setInternalValue([]);
		}
	}, [value]);

	const handleChange = (selectedOptions: any) => {
		const values = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
		setInternalValue(values);
		updateNodeParamValue(JSON.stringify(values));
	};

	const options = JSON.parse(param.value as string) as { label: string; value: string }[]


	const selectedValues = options.filter(option =>
		internalValue.includes(option.value)
	);

	return (
		<div className="space-y-1 p-1 w-full">
			<Label htmlFor={id} className="text-xs flex">
				{param.name}
				{param.required && <p className="text-red-500 px-2">*</p>}
			</Label>
			<Select
				id={id}
				isDisabled={disabled}
				options={options}
				isMulti
				value={selectedValues}
				onChange={handleChange}
				className="text-xs"
				classNamePrefix="select"
				placeholder="Select options..."
			/>
			{param.helperText && (
				<p className="text-muted-foreground px-2">{param.helperText}</p>
			)}
		</div>
	);
}
