import { Environment, ExecutionEnvironment } from "@/types/executor";
import { DatabaseConnectorTask } from "../task/DatabaseConnector";
import { createConnection, Connection } from 'typeorm';

export async function databaseConnectorExecutor(
	environment: ExecutionEnvironment<typeof DatabaseConnectorTask>
) {
	try {
		const databaseUrl = environment.getInput("Database URL");
		const databaseProvider = environment.getInput("Database Provider").toLowerCase();

		let type: 'mysql' | 'postgres' | 'sqlite' | 'mongodb';

		switch (databaseProvider) {
			case 'mysql': type = 'mysql'; break;
			case 'postgresql': case 'postgres': type = 'postgres'; break;
			case 'sqlite': type = 'sqlite'; break;
			case 'mongodb': type = 'mongodb'; break;
			default: throw new Error(`Unsupported database provider: ${databaseProvider}`);
		}

		const connection = await createConnection({
			type: type as any,
			url: databaseUrl,
			synchronize: false,
			logging: false
		});

		console.log("this is connection", connection)

		environment.setDatabase(connection);
		environment.log.info(`Successfully connected to ${databaseProvider} database using TypeORM`);

		return true;
	} catch (error: any) {
		environment.log.error(`Database connection failed: ${error.message}`);
		return false;
	}
}
