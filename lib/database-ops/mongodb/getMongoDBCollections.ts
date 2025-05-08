import { Db } from "mongodb";

export async function getMongoDBCollections(db: Db, collectionName: string): Promise<string[]> {
	try {
		const collection = db.collection(collectionName);
		const sampleDoc = await collection.findOne({}, { projection: { _id: 0 } });
		collection.find({}, {})
		if (!sampleDoc) return [];

		const fields = new Set<string>();
		extractFieldPaths(sampleDoc, '', fields);
		return Array.from(fields).sort();
	} catch (error) {
		console.error(`Error analyzing fields for ${collectionName}:`, error);
		return [];
	}
}

function extractFieldPaths(doc: any, prefix: string, fields: Set<string>): void {
	for (const [key, value] of Object.entries(doc)) {
		const fullPath = prefix ? `${prefix}.${key}` : key;

		if (value && typeof value === 'object' && !Array.isArray(value)) {
			extractFieldPaths(value, fullPath, fields);
		} else {
			fields.add(fullPath);
		}
	}
}
