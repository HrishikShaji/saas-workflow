import { Environment, EnvironmentDatabase, ExecutionEnvironment } from "@/types/executor";
import { Db } from "mongodb";
import { DatabaseAnalyserTask } from "../task/DatabaseAnalyser";
import { getMongoDBCollections } from "@/lib/database-ops/mongodb/getMongoDBCollections";


export async function databaseAnalyserExecutor(
	environment: ExecutionEnvironment<typeof DatabaseAnalyserTask>
) {
	const { instance } = environment.getDatabase() as EnvironmentDatabase;

	if (!instance?.db) {
		environment.log.error(`No Database instance found`);
		return false;
	}

	try {

		const collections = await instance.db.collections();
		const collectionNames = collections.map(c => c.collectionName);

		const completeCollections = await Promise.all(
			collectionNames.map(async name => ({
				collectionName: name,
				fields: await getMongoDBCollections(instance.db as Db, name)
			}))
		);

		console.log(completeCollections)

		environment.setOutput("Database Collections", JSON.stringify(completeCollections));

		environment.log.info(`${JSON.stringify(collectionNames)} successfully fetched`);
		return true;

	} catch (error: any) {
		environment.log.error(`Database operation failed: ${error.message}`);
		console.error(error);
		return false;
	}
}

