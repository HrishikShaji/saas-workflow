
import { Environment, ExecutionEnvironment } from "@/types/executor"
import { PolisherAgentTask } from "../task/PolisherAgent"
import { callStructuredLLMwithJSON } from "../ai/callStructuredLLMwithJSON"

function transform(input: Record<string, any>, outputFormat: Record<string, any>) {
	const result = {};

	for (const [newKey, path] of Object.entries(outputFormat)) {
		// Extract the property path (e.g., 'properties.title' → ['title'])
		const pathParts = path.split('.').slice(1); // Ignore 'properties'
		let value = input;

		// Traverse the path to get the value
		for (const part of pathParts) {
			value = value[part];
			if (value === undefined) break;
		}
		//@ts-ignore
		result[newKey] = value;
	}

	return result;
}

export async function polisherAgentExecutor(environment: ExecutionEnvironment<typeof PolisherAgentTask>) {
	try {
		environment.log.info("Starting polishing process")

		let validInput;

		const input = environment.getInput("content")
		const model = environment.getSetting("Model")
		const temperature = parseInt(environment.getSetting("Temperature"))
		const maxTokens = parseInt(environment.getSetting("Max Tokens"))
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"))

		const outputFormat = environment.getSetting("Output format")
		const schemaString = environment.getSetting("Schema")
		const customInputsString = environment.getSetting("customInputs")
		const customInputs = JSON.parse(customInputsString)
		const userSchema = JSON.parse(schemaString)

		try {
			const parsed = JSON.parse(input)
			const parsedOutputFormat = JSON.parse(outputFormat)
			const transformedValues = transform(parsed, parsedOutputFormat)
			console.log("@@PARSEDINPUT", parsed)
			console.log("@@PARSEDOUTPUTFORMAT", parsedOutputFormat)
			console.log("@@TRANSFORMEDVALUES", transformedValues)

		} catch (err) {
			validInput = input
		}


		//const parsed = JSON.parse(input)
		//const intro = parsed.intro


		environment.log.info(`Sending request to ${model},temperature:${temperature},max tokens:${maxTokens},providers order:${JSON.stringify(providersOrder)}`)


		const promptTemplate = `You are a professional formatter. Polish the following legal draft into a clean, professional document ready for export:
                ---
                ${input}
                `
		const jsonResult = await callStructuredLLMwithJSON(
			{
			},
			{
				model,
				temperature,
				schema: userSchema,
				promptTemplate,
				inputVariables: [],
			}
		);
		//console.log("@@USERSCHEMA", userSchema)
		//console.log("@@JSONRESULT", jsonResult)
		//console.log("@@INPUT", parsed)
		//const parsedOutputFormat = JSON.parse(outputFormat)
		//console.log("@@OUTPUTFORMAT", parsedOutputFormat)

		//console.log("@@CUSTOMINPUTS", customInputsString)

		//const transformedValues = transform(parsed, parsedOutputFormat)

		//console.log("@@TRANSFORMED", transformedValues)

		if (!jsonResult.success) {
			throw new Error(jsonResult.error || "Failed to generate content");
		}

		// Format the structured output for your system


		if (!jsonResult.data) {
			environment.log.error("no data")
			return false
		}
		environment.setOutput("AI Response", JSON.stringify(jsonResult.data))
		environment.log.info("Polishing process completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
