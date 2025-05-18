
import { Environment, ExecutionEnvironment } from "@/types/executor"
import { PolisherAgentTask } from "../task/PolisherAgent"
import { callStructuredLLMwithJSON } from "../ai/callStructuredLLMwithJSON"
import { TaskRegistry } from "../task/registry";

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

		const content = environment.getInput("content")

		try {
			const parsedContent = JSON.parse(content)
			console.log("@@PARSE_SUCCESS", parsedContent)
			validInput = parsedContent
		} catch (error) {
			console.log("@@PARSE_FAIL", error)
			validInput = content
		}

		console.log("@@VALID-INPUT", validInput)

		const customInputsString = environment.getSetting("customInputs")
		const customInputs = JSON.parse(customInputsString)
		const transformedValues = transform(validInput, customInputs)

		console.log("@@TRANSFORMED-VALUES", transformedValues)

		const model = environment.getSetting("Model")
		const polisherAgentInputs = TaskRegistry["POLISHER_AGENT"].inputs


		const temperature = parseInt(environment.getSetting("Temperature"))
		const maxTokens = parseInt(environment.getSetting("Max Tokens"))
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"))


		{/*
		try {
			console.log("@@CONTENT", content)
			console.log("@@CUSTOMINPUTS", customInputs)
			const parsed = JSON.parse(content)
			const transformedValues = transform(parsed, polisherAgentInputs)
			console.log("@@PARSEDINPUT", parsed)
			console.log("@@TRANSFORMEDVALUES", transformedValues)
			validInput = "make some document"
		} catch (err) {
			validInput = content
		}
	*/}



		environment.log.info(`Sending request to ${model},temperature:${temperature},max tokens:${maxTokens},providers order:${JSON.stringify(providersOrder)}`)


		const promptTemplate = `You are a professional formatter. Polish the following legal draft into a clean, professional document ready for export:
                ---
                ${content}
                `

		{/*
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
		if (!jsonResult.success) {
			throw new Error(jsonResult.error || "Failed to generate content");
		}
		if (!jsonResult.data) {
			environment.log.error("no data")
			return false
		}
	*/}

		environment.setOutput("AI Response", JSON.stringify("sample"))
		environment.log.info("Polishing process completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
