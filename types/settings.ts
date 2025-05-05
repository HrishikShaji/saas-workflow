export enum SettingsParamType {
        STRING = "STRING",
        NUMBER = "NUMBER"
}


export interface SettingsParam {
        name: string;
        type: SettingsParamType;
        helperText?: string;
        required?: boolean;
        hideHandle?: boolean;
        value?: string;
        [key: string]: any
}
