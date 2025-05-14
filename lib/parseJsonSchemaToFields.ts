import { SchemaField } from '@/types/schema';

export function parseJsonSchemaToFields(jsonSchemaString: string): SchemaField[] {
        const jsonSchema = JSON.parse(jsonSchemaString);
        const fields: SchemaField[] = [];

        if (jsonSchema.type !== 'object' || !jsonSchema.properties) {
                throw new Error('Invalid JSON Schema: expected an object with properties');
        }

        for (const [fieldName, fieldSchema] of Object.entries(jsonSchema.properties as Record<string, any>)) {
                const field: SchemaField = {
                        name: fieldName,
                        type: fieldSchema.type,
                        description: fieldSchema.description || '',
                        required: jsonSchema.required?.includes(fieldName) || false,
                        rules: {}
                };

                // Handle validation rules based on type
                if (fieldSchema.type === 'string') {
                        if (fieldSchema.minLength !== undefined && fieldSchema.maxLength !== undefined) {
                                if (fieldSchema.minLength === fieldSchema.maxLength) {
                                        field.rules.length = fieldSchema.minLength;
                                } else {
                                        field.rules.min = fieldSchema.minLength;
                                        field.rules.max = fieldSchema.maxLength;
                                }
                        } else {
                                if (fieldSchema.minLength !== undefined) {
                                        field.rules.min = fieldSchema.minLength;
                                }
                                if (fieldSchema.maxLength !== undefined) {
                                        field.rules.max = fieldSchema.maxLength;
                                }
                        }
                        if (fieldSchema.pattern) {
                                field.rules.pattern = fieldSchema.pattern;
                        }
                        if (fieldSchema.format === 'email') {
                                field.rules.email = true;
                        }
                        if (fieldSchema.format === 'url') {
                                field.rules.url = true;
                        }
                        if (fieldSchema.format === 'uuid') {
                                field.rules.uuid = true;
                        }
                } else if (fieldSchema.type === 'number') {
                        if (fieldSchema.minimum !== undefined) {
                                field.rules.min = fieldSchema.minimum;
                        }
                        if (fieldSchema.maximum !== undefined) {
                                field.rules.max = fieldSchema.maximum;
                        }
                }
                // Note: array and object types might need additional handling if you have more complex rules

                fields.push(field);
        }

        return fields;
}
