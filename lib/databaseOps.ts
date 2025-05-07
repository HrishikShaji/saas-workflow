import { DataSource } from "typeorm";

export async function getTablesFromSQLDatabase(connection: DataSource): Promise<string[]> {
        const queryRunner = connection.createQueryRunner();

        try {
                await queryRunner.connect();
                let tables: any[];

                switch (connection.options.type) {
                        case 'mysql':
                                tables = await queryRunner.query('SHOW TABLES');
                                return tables.map(table => Object.values(table)[0] as string);
                        case 'postgres':
                                tables = await queryRunner.query(
                                        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
                                );
                                return tables.map(table => table.table_name);
                        case 'sqlite':
                                tables = await queryRunner.query(
                                        "SELECT name FROM sqlite_master WHERE type='table'"
                                );
                                return tables.map(table => table.name);
                        default:
                                throw new Error(`Unsupported database type: ${connection.options.type}`);
                }
        } finally {
                await queryRunner.release();
        }
}

export async function getCollectionsFromMongoDB(connection: DataSource): Promise<string[]> {
        try {
                const mongoQueryRunner = connection.createQueryRunner() as any;
                const client = mongoQueryRunner.databaseConnection;

                const dbName = connection.options.database as string;
                const db = client.db(dbName);

                const collections = await db.listCollections().toArray();
                return collections.map((collection: any) => collection.name);
        } catch (error) {
                console.error("Error fetching MongoDB collections:", error);
                throw error;
        } finally {
                await connection.destroy();
        }
}
