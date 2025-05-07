import { Environment, EnvironmentDatabase, ExecutionEnvironment } from "@/types/executor";
import { DatabaseOperatorTask } from "../task/DatabaseOperator";
import { getItemsFromMongoDBCollection } from "@/lib/getItemsFromMongDBCollection";

export async function databaseOperatorExecutor(
	environment: ExecutionEnvironment<typeof DatabaseOperatorTask>
) {
	const { instance } = environment.getDatabase() as EnvironmentDatabase;

	console.log("this is instance", instance)

	if (!instance?.db) {
		environment.log.error(`no Database instance found`);
		return false
	}

	try {
		const collectionName = environment.getInput("table");


		const users = await getItemsFromMongoDBCollection(
			instance.db,
			collectionName,
			{ _id: 1, name: 1, email: 1 },
			{ name: 1 }
		);

		environment.setOutput("Response", `${JSON.stringify(users)}`)
		environment.log.info(`${collectionName} successfully fetched`)

		console.log("this is users", users)
		return true

	} catch (error: any) {
		environment.log.error(`Database operation failed: ${error.message}`);
		console.log(error)
		return false;
	}
}
