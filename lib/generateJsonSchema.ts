import { SchemaField } from '@/types/schema';

export function generateJsonSchema(fields: SchemaField[]): string {
        if (!fields.length) {
                throw new Error('At least one field is required');
        }

        const jsonSchema: any = {
                type: "object",
                properties: {},
                required: []
        };

        for (const field of fields) {
                if (!field.name) {
                        throw new Error('All fields must have a name');
                }

                const fieldSchema: any = {
                        type: field.type
                };

                // Add description if provided
                if (field.description) {
                        fieldSchema.description = field.description;
                }

                if (field.value) {
                        fieldSchema.value = field.value
                }

                // Add validation rules
                if (field.type === 'string') {
                        if (field.rules.min !== undefined) {
                                fieldSchema.minLength = field.rules.min;
                        }
                        if (field.rules.max !== undefined) {
                                fieldSchema.maxLength = field.rules.max;
                        }
                        if (field.rules.length !== undefined) {
                                fieldSchema.minLength = field.rules.length;
                                fieldSchema.maxLength = field.rules.length;
                        }
                        if (field.rules.pattern) {
                                fieldSchema.pattern = field.rules.pattern;
                        }
                        if (field.rules.email) {
                                fieldSchema.format = 'email';
                        }
                        if (field.rules.url) {
                                fieldSchema.format = 'url';
                        }
                        if (field.rules.uuid) {
                                fieldSchema.format = 'uuid';
                        }
                } else if (field.type === 'number') {
                        if (field.rules.min !== undefined) {
                                fieldSchema.minimum = field.rules.min;
                        }
                        if (field.rules.max !== undefined) {
                                fieldSchema.maximum = field.rules.max;
                        }
                } else if (field.type === 'array') {
                        fieldSchema.items = { type: 'any' }; // Basic array items, can be enhanced
                } else if (field.type === 'object') {
                        fieldSchema.properties = {}; // Basic object, can be enhanced
                }

                jsonSchema.properties[field.name] = fieldSchema;

                // Add to required array if field is required
                if (field.required) {
                        jsonSchema.required.push(field.name);
                }
        }

        return JSON.stringify(jsonSchema, null, 2);
}
