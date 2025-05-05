import { SettingsParam, SettingsParamType } from "@/types/settings";

export const nodeSettings = [
        { name: "Model", type: SettingsParamType.STRING }
] as const satisfies SettingsParam[];
