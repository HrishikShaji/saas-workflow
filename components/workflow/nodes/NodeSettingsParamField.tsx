import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import { useCallback } from "react";
import { SettingsParam, SettingsParamType } from "@/types/settings";
import SettingsStringParam from "./params/SettingsStringParam";
import SettingsDropdownParam from "./params/SettingsDropdownParam";
import SettingsNumberParam from "./params/SettingsNumberParam";
import NodeSettingsMultiSelectParam from "./params/SettingsMultiSelectParam";
import { providersOrder } from "@/lib/constants";

interface Props {
	param: SettingsParam;
	nodeId: string;
	disabled: boolean;
}

export default function NodeSettingsParamField({ param, nodeId, disabled }: Props) {
	console.log(param)
	const { updateNodeData, getNode } = useReactFlow()
	const node = getNode(nodeId) as AppNode

	const value = node?.data.settings?.[param.name] || param.value
	const updateNodeParamValue = useCallback((newValue: string) => {
		console.log("this is updated", value)
		updateNodeData(nodeId, {
			settings: {
				...node?.data.settings,
				[param.name]: newValue
			}
		})
	}, [param.name, updateNodeData, node?.data.settings, nodeId])

	switch (param.type) {
		case SettingsParamType.STRING:
			return <SettingsStringParam
				param={param}
				value={value}
				updateNodeParamValue={updateNodeParamValue}
				disabled={disabled}
			/>
		case SettingsParamType.NUMBER:
			return <SettingsNumberParam
				param={param}
				value={value}
				updateNodeParamValue={updateNodeParamValue}
				disabled={disabled}
			/>
		case SettingsParamType.DROPDOWN:
			return <SettingsDropdownParam
				param={param}
				value={value}
				updateNodeParamValue={updateNodeParamValue}
				disabled={disabled}
			/>
		case SettingsParamType.ORDER:
			return <NodeSettingsMultiSelectParam
				options={providersOrder}
				value={JSON.parse(value)}
				onChange={(values) => updateNodeParamValue(JSON.stringify(values))}
			//disabled={disabled}
			/>

		default: return (
			<div className="w-full">
				<p className="text-xs text-muted-foreground">Not implemented</p>
			</div>
		)
	}

}
