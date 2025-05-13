// types/schemaBuilder.ts
export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';

export interface ValidationRules {
        min?: number;
        max?: number;
        length?: number;
        pattern?: string;
        email?: boolean;
        url?: boolean;
        uuid?: boolean;
}

export interface SchemaField {
        name: string;
        type: FieldType;
        description?: string;
        required: boolean;
        rules: {
                min?: number;
                max?: number;
                length?: number;
                pattern?: string;
                email?: boolean;
                url?: boolean;
                uuid?: boolean;
        };
}
