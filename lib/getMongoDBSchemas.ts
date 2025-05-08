import { Db, Collection, Document } from 'mongodb';

interface CollectionInfo {
        name: string;
        fields: string[];
        sampleDocument?: Document;
}

export async function getMongoDBSchemas(
        db: Db,
        sampleSize: number = 1
): Promise<CollectionInfo[]> {
        if (!db) {
                throw new Error('Database instance not provided');
        }

        try {
                // Get all collections in the database
                const collections = await db.listCollections().toArray();
                const result: CollectionInfo[] = [];

                for (const collectionInfo of collections) {
                        const collectionName = collectionInfo.name;
                        const collection = db.collection(collectionName);

                        // Get sample documents to determine fields
                        const sampleDocs = await collection.find().limit(sampleSize).toArray();
                        const fields = new Set<string>();

                        // Analyze each sample document
                        sampleDocs.forEach(doc => {
                                extractFieldsFromDocument(doc, '', fields);
                        });

                        result.push({
                                name: collectionName,
                                fields: Array.from(fields).sort(),
                                sampleDocument: sampleDocs[0] // Optional: include a sample document
                        });
                }

                return result;
        } catch (error) {
                console.error('Error fetching database schema:', error);
                throw error;
        }
}

function extractFieldsFromDocument(
        doc: Document,
        prefix: string,
        fields: Set<string>
): void {
        for (const [key, value] of Object.entries(doc)) {
                const fullPath = prefix ? `${prefix}.${key}` : key;

                if (value && typeof value === 'object' && !Array.isArray(value)) {
                        // Recursively process nested objects
                        extractFieldsFromDocument(value, fullPath, fields);
                } else {
                        // Add the field path
                        fields.add(fullPath);
                }
        }
}
