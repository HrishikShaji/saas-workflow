import { SettingsParam, SettingsParamType } from "@/types/settings";


export const nodeSettings = [
        { name: "Model", type: SettingsParamType.DROPDOWN, value: "meta-llama/llama-4-maverick" },
        { name: "Temperature", type: SettingsParamType.NUMBER, value: "" },
        { name: "Max Tokens", type: SettingsParamType.NUMBER, value: "" },
        { name: "Providers Order", type: SettingsParamType.ORDER, value: "" },
        { name: "Schema", type: SettingsParamType.STRING, value: "" },
        { name: "Output format", type: SettingsParamType.STRING, value: "" },
        { name: "customInputs", type: SettingsParamType.STRING, value: "" }
] as const satisfies SettingsParam[];

export const models = [
        "gpt-4o-mini",
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

// Median household income data by state (2023 estimates)
export const stateIncomeData = [
        { id: "01", state: "Alabama", income: 54943 },
        { id: "02", state: "Alaska", income: 77845 },
        { id: "04", state: "Arizona", income: 65913 },
        { id: "05", state: "Arkansas", income: 50784 },
        { id: "06", state: "California", income: 84097 },
        { id: "08", state: "Colorado", income: 82254 },
        { id: "09", state: "Connecticut", income: 83572 },
        { id: "10", state: "Delaware", income: 72723 },
        { id: "11", state: "District of Columbia", income: 93547 },
        { id: "12", state: "Florida", income: 63062 },
        { id: "13", state: "Georgia", income: 65030 },
        { id: "15", state: "Hawaii", income: 88005 },
        { id: "16", state: "Idaho", income: 66474 },
        { id: "17", state: "Illinois", income: 72563 },
        { id: "18", state: "Indiana", income: 62743 },
        { id: "19", state: "Iowa", income: 65429 },
        { id: "20", state: "Kansas", income: 64521 },
        { id: "21", state: "Kentucky", income: 55573 },
        { id: "22", state: "Louisiana", income: 53571 },
        { id: "23", state: "Maine", income: 64767 },
        { id: "24", state: "Maryland", income: 91431 },
        { id: "25", state: "Massachusetts", income: 89026 },
        { id: "26", state: "Michigan", income: 63202 },
        { id: "27", state: "Minnesota", income: 77706 },
        { id: "28", state: "Mississippi", income: 48716 },
        { id: "29", state: "Missouri", income: 61847 },
        { id: "30", state: "Montana", income: 60560 },
        { id: "31", state: "Nebraska", income: 66849 },
        { id: "32", state: "Nevada", income: 65686 },
        { id: "33", state: "New Hampshire", income: 83449 },
        { id: "34", state: "New Jersey", income: 89703 },
        { id: "35", state: "New Mexico", income: 54020 },
        { id: "36", state: "New York", income: 75548 },
        { id: "37", state: "North Carolina", income: 60516 },
        { id: "38", state: "North Dakota", income: 68882 },
        { id: "39", state: "Ohio", income: 62262 },
        { id: "40", state: "Oklahoma", income: 55826 },
        { id: "41", state: "Oregon", income: 71562 },
        { id: "42", state: "Pennsylvania", income: 67587 },
        { id: "44", state: "Rhode Island", income: 74008 },
        { id: "45", state: "South Carolina", income: 59318 },
        { id: "46", state: "South Dakota", income: 63920 },
        { id: "47", state: "Tennessee", income: 59695 },
        { id: "48", state: "Texas", income: 67321 },
        { id: "49", state: "Utah", income: 79133 },
        { id: "50", state: "Vermont", income: 67674 },
        { id: "51", state: "Virginia", income: 80615 },
        { id: "53", state: "Washington", income: 85301 },
        { id: "54", state: "West Virginia", income: 51248 },
        { id: "55", state: "Wisconsin", income: 67119 },
        { id: "56", state: "Wyoming", income: 68002 },
]

