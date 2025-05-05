import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import { useCallback } from "react";
import { SettingsParam, SettingsParamType } from "@/types/settings";
import SettingsStringParam from "./params/SettingsStringParam";

interface Props {
	param: SettingsParam;
	nodeId: string;
	disabled: boolean;
}

export default function NodeSettingsParamField({ param, nodeId, disabled }: Props) {

	const { updateNodeData, getNode } = useReactFlow()
	const node = getNode(nodeId) as AppNode

	const value = node?.data.settings?.[param.name]
	const updateNodeParamValue = useCallback((newValue: string) => {
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
		default: return (
			<div className="w-full">
				<p className="text-xs text-muted-foreground">Not implemented</p>
			</div>
		)
	}

}
