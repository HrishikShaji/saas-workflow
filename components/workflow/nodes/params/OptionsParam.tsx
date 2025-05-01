import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppNode, ParamProps } from "@/types/appNode";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export default function OptionsParam({ param, value, updateNodeParamValue, disabled }: ParamProps) {
	const [options, setOptions] = useState<string[]>([]);
	const [newOption, setNewOption] = useState("");
	const id = useId();

	useEffect(() => {
		try {
			if (value) {
				const parsedValue = JSON.parse(value);
				if (Array.isArray(parsedValue)) {
					setOptions(parsedValue);
				}
			} else {
				setOptions([]);
			}
		} catch (e) {
			setOptions([]);
		}
	}, [value]);

	const handleAddOption = () => {
		if (newOption.trim() && !options.includes(newOption.trim())) {
			const updatedOptions = [...options, newOption.trim()];
			setOptions(updatedOptions);
			updateNodeParamValue(JSON.stringify(updatedOptions));
			setNewOption("");
		}
	};

	const handleRemoveOption = (index: number) => {
		const updatedOptions = options.filter((_, i) => i !== index);
		setOptions(updatedOptions);
		updateNodeParamValue(JSON.stringify(updatedOptions));
	};

	return (
		<div className="space-y-2 p-1 w-full">
			<Label htmlFor={id} className="text-xs flex">
				{param.name}
				{param.required && <p className="text-red-500 px-2">*</p>}
			</Label>

			{/* Display existing options */}
			<div className="space-y-1">
				{options.map((option, index) => (
					<div key={index} className="flex items-center gap-2">
						<Input
							disabled={true}
							value={option}
							className="text-xs"
						/>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleRemoveOption(index)}
							disabled={disabled}
						>
							<X className="h-3 w-3" />
						</Button>
					</div>
				))}
			</div>

			{/* Add new option */}
			<div className="flex items-center gap-2">
				<Input
					disabled={disabled}
					id={id}
					className="text-xs"
					value={newOption}
					placeholder="Enter new option"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewOption(e.target.value)}
					onKeyDown={(e: React.KeyboardEvent) => {
						if (e.key === "Enter") {
							handleAddOption();
						}
					}}
				/>
				<Button
					variant="outline"
					size="sm"
					onClick={handleAddOption}
					disabled={disabled || !newOption.trim()}
				>
					<Plus className="h-3 w-3" />
				</Button>
			</div>

			{param.helperText && (
				<p className="text-muted-foreground px-2 text-xs">{param.helperText}</p>
			)}
		</div>
	);
}
