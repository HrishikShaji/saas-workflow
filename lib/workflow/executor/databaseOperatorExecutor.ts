import { Environment, EnvironmentDatabase, ExecutionEnvironment } from "@/types/executor";
import { DatabaseOperatorTask } from "../task/DatabaseOperator";
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse";
import { models, providersOrder } from "@/lib/constants";
import { getMongDBItemsInCollection } from "@/lib/database-ops/mongodb/getMongoDBItemsInCollection";
import { getMongoDBTemplate } from "@/lib/database-ops/mongodb/getMongoDBTemplate";


export async function databaseOperatorExecutor(
	environment: ExecutionEnvironment<typeof DatabaseOperatorTask>
) {
	const { instance } = environment.getDatabase() as EnvironmentDatabase;

	if (!instance?.db) {
		environment.log.error(`No Database instance found`);
		return false;
	}

	try {
		const prompt = environment.getInput("query");
		const collections = environment.getInput("Database Collections")


		const systemMessage = getMongoDBTemplate(collections);

		const aiResponse = await getOpenRouterResponse({
			systemMessage,
			query: prompt,
			model: models[0],
			temperature: 0.3,
			maxTokens: 500,
			providersOrder: providersOrder

		})

		console.log("this is ai response", aiResponse)

		const result = await getMongDBItemsInCollection({ db: instance.db, aiResponse })

		environment.setOutput("Response", JSON.stringify(result));

		environment.log.info(`query successfully fetched`);
		return true;

	} catch (error: any) {
		environment.log.error(`Database operation failed: ${error.message}`);
		console.error(error);
		return false;
	}
}

