// types/textTransform.ts
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko' | "ml" | "hi";
export type TextFormat = 'json' | 'xml' | 'csv' | 'yaml';
export type ComplexityLevel = 'high' | 'medium' | 'low';

export interface SummarizeParams {
        type: 'extractive' | 'abstractive';
        maxLength?: number;
}

export interface TranslateParams {
        targetLanguage: LanguageCode;
}

export interface SimplifyParams {
        level: ComplexityLevel;
}

export interface ElaborateParams {
        level: ComplexityLevel;
}

export interface FormatConvertParams {
        targetFormat: TextFormat;
}
