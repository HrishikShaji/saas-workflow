import { MongoClient, Db, MongoClientOptions } from 'mongodb';

export interface MongoDBConnectionResult {
        client: MongoClient;
        db: Db | null;
}

export async function connectToMongoDB(
        url: string,
        dbName?: string,
        options: MongoClientOptions = {}
): Promise<MongoDBConnectionResult> {
        const defaultOptions: MongoClientOptions = {
                connectTimeoutMS: 5000,
                serverSelectionTimeoutMS: 5000,
        };

        const mergedOptions: MongoClientOptions = { ...defaultOptions, ...options };

        const client = new MongoClient(url, mergedOptions);

        try {
                await client.connect();

                await client.db().admin().ping();

                console.log(`Successfully connected to MongoDB at ${url}`);

                const db = dbName ? client.db(dbName) : null;
                if (db) {
                        console.log(`Using database: ${dbName}`);
                }

                return { client, db };
        } catch (error) {
                console.error('Error connecting to MongoDB:', error);
                await client.close();
                throw error;
        }
}
