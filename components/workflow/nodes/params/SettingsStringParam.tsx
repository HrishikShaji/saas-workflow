
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { AppNode, ParamProps, SettingsParamProps } from "@/types/appNode";
import { useEffect, useId, useState } from "react";


export default function SettingsStringParam({ param, value, updateNodeParamValue, disabled }: SettingsParamProps) {
	const [internalValue, setInternalValue] = useState("")
	const id = useId()

	useEffect(() => {
		console.log("this is latest value", value)
		setInternalValue(value || "")
	}, [value])

	let Component: any = Input

	if (param.variant === "textarea") {
		Component = Textarea
	}
	return <div className="space-y-1 p-1 w-full">
		<Label htmlFor={id} className="text-xs flex">
			{param.name}
			{param.required && <p className="text-red-500 px-2">*</p>}
		</Label>
		<Component
			disabled={disabled}
			id={id}
			className="text-xs"
			value={internalValue}
			placeholder="Enter value here"
			onChange={(e: any) => setInternalValue(e.target.value)}
			onBlur={(e: any) => updateNodeParamValue(e.target.value)}
		/>
		{param.helperText && (
			<p className="text-muted-foreground px-2">{param.helperText}</p>
		)}
	</div>
}
