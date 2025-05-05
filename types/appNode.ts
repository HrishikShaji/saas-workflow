import { Node } from "@xyflow/react"
import { TaskParam, TaskType } from "./task";
import { SettingsParam } from "./settings";

export interface AppNodeData {
        [key: string]: any;
        type: TaskType;
        inputs: Record<string, string>;
        settings: Record<string, string>;

}

export interface AppNode extends Node {
        data: AppNodeData
}

export interface ParamProps {
        param: TaskParam;
        value: string;
        updateNodeParamValue: (newValue: string) => void
        disabled?: boolean;
}

export interface SettingsParamProps {
        param: SettingsParam;
        value: string;
        updateNodeParamValue: (newValue: string) => void
        disabled?: boolean;
}

export type AppNodeMissingInput = {
        nodeId: string;
        inputs: string[];
}
