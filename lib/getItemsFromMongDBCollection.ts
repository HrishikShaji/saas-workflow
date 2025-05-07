import { Db, MongoClient, WithId, Document } from 'mongodb';

export async function getItemsFromMongoDBCollection(
        db: Db,
        collectionName: string,
        projection: Document = {},
        sort: Document = {}
): Promise<WithId<Document>[]> {
        try {
                if (!db) {
                        throw new Error('Database instance not provided');
                }

                const collection = db.collection(collectionName);

                // Find all documents with optional projection and sort
                const cursor = collection.find({}, { projection });
                if (Object.keys(sort).length > 0) {
                        cursor.sort(sort);
                }

                // Convert cursor to array
                const items = await cursor.toArray();

                console.log(`Fetched ${items.length} documents from collection ${collectionName}`);
                return items;
        } catch (error) {
                console.error(`Error fetching documents from collection ${collectionName}:`, error);
                throw error;
        }
}
