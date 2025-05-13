import { SettingsParam, SettingsParamType } from "@/types/settings";


export const nodeSettings = [
        { name: "Model", type: SettingsParamType.DROPDOWN, value: "meta-llama/llama-4-maverick" },
        { name: "Temperature", type: SettingsParamType.NUMBER, value: "" },
        { name: "Max Tokens", type: SettingsParamType.NUMBER, value: "" },
        { name: "Providers Order", type: SettingsParamType.ORDER, value: "" },
        { name: "Schema", type: SettingsParamType.STRING, value: "" }
] as const satisfies SettingsParam[];

export const models = [
        "meta-llama/llama-4-maverick",
        "inception/mercury-coder-small-beta",
        "opengvlab/internvl3-2b:free",
        "deepseek/deepseek-r1-distill-qwen-1.5b",
        "google/gemini-2.5-pro-preview-03-25",
        "meta-llama/llama-3.2-3b-instruct:free",
        "qwen/qwen2.5-coder-7b-instruct",
        "openai/gpt-3.5-turbo-0613",
        "amazon/nova-micro-v1",
        "mistralai/ministral-3b",
        "perplexity/llama-3.1-sonar-small-128k-online"
] as const

export const providersOrder = [
        "SambaNova",
        "Groq"
] 
