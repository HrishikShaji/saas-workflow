import { SchemaField } from '@/types/schema';
import { z } from 'zod';

export function generateZodSchema(fields: SchemaField[], schemaName: string = 'GeneratedSchema'): string {
        if (!fields.length) {
                throw new Error('At least one field is required');
        }

        const fieldDefinitions: string[] = [];
        const imports = new Set<string>(['z']);

        for (const field of fields) {
                if (!field.name) {
                        throw new Error('All fields must have a name');
                }

                let fieldDefinition = `${field.name}: `;

                // Handle field type
                switch (field.type) {
                        case 'string':
                                fieldDefinition += 'z.string()';
                                break;
                        case 'number':
                                fieldDefinition += 'z.number()';
                                break;
                        case 'boolean':
                                fieldDefinition += 'z.boolean()';
                                break;
                        case 'date':
                                fieldDefinition += 'z.date()';
                                imports.add('date-fns'); // Optional: add if you want to include date validation
                                break;
                        case 'array':
                                fieldDefinition += 'z.array(z.any())'; // Basic array, can be enhanced
                                break;
                        case 'object':
                                fieldDefinition += 'z.object({})'; // Basic object, can be enhanced
                                break;
                        default:
                                throw new Error(`Unsupported field type: ${field.type}`);
                }

                // Add description if provided
                if (field.description) {
                        fieldDefinition += `.describe("${field.description}")`;
                }

                // Add validation rules
                if (field.type === 'string') {
                        if (field.rules.min !== undefined) {
                                fieldDefinition += `.min(${field.rules.min})`;
                        }
                        if (field.rules.max !== undefined) {
                                fieldDefinition += `.max(${field.rules.max})`;
                        }
                        if (field.rules.length !== undefined) {
                                fieldDefinition += `.length(${field.rules.length})`;
                        }
                        if (field.rules.pattern) {
                                fieldDefinition += `.regex(/${field.rules.pattern}/)`;
                        }
                        if (field.rules.email) {
                                fieldDefinition += `.email()`;
                        }
                        if (field.rules.url) {
                                fieldDefinition += `.url()`;
                        }
                        if (field.rules.uuid) {
                                fieldDefinition += `.uuid()`;
                        }
                } else if (field.type === 'number') {
                        if (field.rules.min !== undefined) {
                                fieldDefinition += `.min(${field.rules.min})`;
                        }
                        if (field.rules.max !== undefined) {
                                fieldDefinition += `.max(${field.rules.max})`;
                        }
                }

                // Handle required/optional
                if (!field.required) {
                        fieldDefinition += '.optional()';
                }

                fieldDefinitions.push(fieldDefinition);
        }

        // Construct the final schema
        const schemaCode = `export const ${schemaName} = z.object({\n` +
                `  ${fieldDefinitions.join(',\n  ')}\n` +
                `});\n\n`


        return schemaCode;
}
