import { SettingsParam, SettingsParamType } from "@/types/settings";

export const nodeSettings = [
        { name: "Model", type: SettingsParamType.NUMBER }
] as const satisfies SettingsParam[];
