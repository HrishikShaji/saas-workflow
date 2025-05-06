import { Label } from "@/components/ui/label"
import { AppNode, ParamProps, SettingsParamProps } from "@/types/appNode";
import { useEffect, useId, useState } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { models } from "@/lib/constants";

export default function SettingsDropdownParam({
	param,
	value,
	updateNodeParamValue,
	disabled
}: SettingsParamProps) {
	const id = useId()

	return (
		<div className="space-y-1 p-1 w-full">
			<Label htmlFor={id} className="text-xs flex">
				{param.name}
				{param.required && <p className="text-red-500 px-2">*</p>}
			</Label>
			<Select
				value={value}
				onValueChange={updateNodeParamValue}
				disabled={disabled}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={`Select ${param.name}`} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>{param.name}</SelectLabel>
						{models.map((model, i) => (
							<SelectItem key={i} value={model}>{model}</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{param.helperText && (
				<p className="text-muted-foreground px-2 text-xs">{param.helperText}</p>
			)}
		</div>
	)
}
