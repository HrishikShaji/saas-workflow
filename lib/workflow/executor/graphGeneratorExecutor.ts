import { Environment, EnvironmentDatabase, ExecutionEnvironment } from "@/types/executor";
import { GraphGeneratorTask } from "../task/GraphGenerator";
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse";
import { models, providersOrder } from "@/lib/constants";


export async function graphGeneratorExecutor(
	environment: ExecutionEnvironment<typeof GraphGeneratorTask>
) {

	try {
		const chartData = environment.getInput("Chart Data")

		const systemMessage = `You are a React Recharts graph library expert .you convert data into suitable types of chart data according to the data and return a json for output.
--------
return only valid json no additional text or characters.
the format shouled be an array of objects.
each object for each chart that can be generated.
each object should be like {
"type":"lineChart",
"data":[]
}

`

		const aiResponse = await getOpenRouterResponse({
			model: models[0],
			providersOrder: providersOrder,
			maxTokens: 2000,
			systemMessage,
			query: chartData,
			temperature: 0.3
		})

		console.log(aiResponse)


		environment.setOutput("Graph Response", aiResponse)
		environment.log.info(`graph successfully generated`);
		return true;

	} catch (error: any) {
		environment.log.error(`Database operation failed: ${error.message}`);
		console.error(error);
		return false;
	}
}

