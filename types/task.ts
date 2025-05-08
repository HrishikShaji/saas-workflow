export enum TaskType {
        LAUNCH_BROWSER = "LAUNCH_BROWSER",
        PAGE_TO_HTML = "PAGE_TO_HTML",
        EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT",
        PROMPT_GENERATOR = "PROMPT_GENERATOR",
        DRAFT_GENERATOR = "DRAFT_GENERATOR",
        CLARITY_AGENT = "CLARITY_AGENT",
        COMPLIANCE_AGENT = "COMPLIANCE_AGENT",
        TONE_AGENT = "TONE_AGENT",
        RISK_REVIEW_AGENT = "RISK_REVIEW_AGENT",
        POLISHER_AGENT = "POLISHER_AGENT",
        OPTIONS_AGENT = "OPTIONS_AGENT",
        DATABASE_CONNECTOR = "DATABASE_CONNECTOR",
        DATABASE_OPERATOR = "DATABASE_OPERATOR",
        DATABASE_ANALYSER = "DATABASE_ANALYSER"
}

export enum TaskParamType {
        STRING = "STRING",
        BROWSER_INSTANCE = "BROWSER_INSTANCE",
        DATABASE_INSTANCE = "DATABASE_INSTANCE",
        AI_RESPONSE = "AI_RESPONSE",
        OPTIONS = "OPTIONS",
        NUMBER = "NUMBER"
}

export interface TaskParam {
        name: string;
        type: TaskParamType;
        helperText?: string;
        required?: boolean;
        hideHandle?: boolean;
        value?: string;
        [key: string]: any
}
