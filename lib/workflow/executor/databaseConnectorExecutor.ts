import { Environment, ExecutionEnvironment } from "@/types/executor";
import { DatabaseConnectorTask } from "../task/DatabaseConnector";
import { connectToMongoDB } from "@/lib/database-ops/mongodb/connectToMongoDB";

export async function databaseConnectorExecutor(
	environment: ExecutionEnvironment<typeof DatabaseConnectorTask>
) {
	try {
		const databaseUrl = environment.getInput("Database URL");
		const databaseProvider = environment.getInput("Database Provider").toLowerCase();

		let type: 'mysql' | 'postgres' | 'sqlite' | 'mongodb';

		let database

		switch (databaseProvider) {
			case 'mysql': type = 'mysql'; break;
			case 'postgresql': case 'postgres': type = 'postgres'; break;
			case 'sqlite': type = 'sqlite'; break;
			case 'mongodb':
				database = await connectToMongoDB(databaseUrl, "test")
				break;
			default: throw new Error(`Unsupported database provider: ${databaseProvider}`);
		}


		//		console.log("this is database", database)
		environment.setDatabase({
			provider: databaseProvider,
			instance: database
		});
		environment.log.info(`Successfully connected to ${databaseProvider}`);

		return true;
	} catch (error: any) {
		environment.log.error(`Database connection failed: ${error.message}`);
		return false;
	}
}
