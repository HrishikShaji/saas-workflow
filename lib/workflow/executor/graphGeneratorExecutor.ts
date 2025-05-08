import { Environment, EnvironmentDatabase, ExecutionEnvironment } from "@/types/executor";
import { GraphGeneratorTask } from "../task/GraphGenerator";
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse";
import { models, providersOrder } from "@/lib/constants";


export async function graphGeneratorExecutor(
	environment: ExecutionEnvironment<typeof GraphGeneratorTask>
) {

	try {
		const chartData = environment.getInput("Chart Data")

		const systemMessage = `You are a React Recharts expert that transforms data into properly formatted chart data objects. Return only valid JSON with an array of chart objects.No additional text or characters.it should be directly parsable. Each object should follow these formats based on chart type:",
  "chartFormats": {
    "barChart": {
      "type": "barChart",
      "data": [],
      "xAxisKey": "string",
      "barKeys": ["string"],
      "colors": ["string"]
    },
    "lineChart": {
      "type": "lineChart",
      "data": [],
      "xAxisKey": "string",
      "lineKeys": ["string"],
      "colors": ["string"],
      "lineTypes": ["string"]
    },
    "pieChart": {
      "type": "pieChart",
      "data": [],
      "dataKey": "string",
      "nameKey": "string",
      "colors": ["string"],
      "innerRadius": "number",
      "outerRadius": "number"
    },
    "areaChart": {
      "type": "areaChart",
      "data": [],
      "xAxisKey": "string",
      "areaKeys": ["string"],
      "colors": ["string"],
      "areaTypes": ["string"],
      "stacked": "boolean",
      "gradient": "boolean"
    }
  },
  "rules": [
    "Return only valid JSON array of chart objects",
    "Each object must match one of the specified formats",
    "Include all required fields for each chart type",
    "Omit optional fields if not needed",
    "Data arrays should contain complete datasets",
    "Keys should match actual data properties"
  ]
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

