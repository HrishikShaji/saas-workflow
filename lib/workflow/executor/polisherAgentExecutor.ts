import { Environment, ExecutionEnvironment } from "@/types/executor"
import { PolisherAgentTask } from "../task/PolisherAgent"
import { callStructuredLLMwithJSON } from "../ai/callStructuredLLMwithJSON"
import parseSettings from "./lib/parseSettings"

interface TransformationResult {
	[key: string]: any
}
function transformData(input: Record<string, any>, outputFormat: Record<string, any>): TransformationResult {
	const result: TransformationResult = {}

	for (const [newKey, path] of Object.entries(outputFormat)) {
		if (typeof path !== 'string') {
			throw new Error(`Invalid path for key ${newKey}: path must be a string`)
		}

		const pathParts = path.split('.').slice(1) // Ignore 'properties'
		let value = input

		for (const part of pathParts) {
			if (value === null || typeof value !== 'object') {
				//				value = undefined
				break
			}
			value = value[part]
		}

		result[newKey] = value
	}

	return result
}

function parseAndTransformInput(content: string, customInputsString: string, logError: (err: string) => void): string {
	try {
		const parsedContent = JSON.parse(content)
		const customInputs = JSON.parse(customInputsString)

		if (typeof parsedContent !== 'object' || parsedContent === null) {
			throw new Error('Parsed content is not an object')
		}

		if (typeof customInputs !== 'object' || customInputs === null) {
			throw new Error('Custom inputs is not an object')
		}

		const transformedValues = transformData(parsedContent, customInputs)

		if (typeof transformedValues.content !== 'string') {
			throw new Error('Transformed content is not a string')
		}

		return transformedValues.content
	} catch (error) {
		// If transformation fails, fall back to original content
		if (error instanceof SyntaxError) {

			logError('Failed to parse JSON input, using raw content')
		} else if (error instanceof Error) {
			logError(`Input transformation failed: ${error.message}, using raw content`)
		}

		return content
	}
}


export async function polisherAgentExecutor(environment: ExecutionEnvironment<typeof PolisherAgentTask>): Promise<boolean> {
	try {
		environment.log.info("Starting polishing process")

		// Parse and validate inputs
		const content = environment.getInput("content")
		if (!content) {
			throw new Error("Content input is required")
		}

		function logError(err: string) {
			environment.log.error(err)
		}

		const customInputsString = environment.getSetting("customInputs") || "{}"
		const validInput = parseAndTransformInput(content, customInputsString, logError)

		// Parse and validate settings
		const { model, userSchema, temperature, maxTokens, providersOrder } = parseSettings(environment)

		environment.log.info(`Sending request to ${model}, temperature: ${temperature}, max tokens: ${maxTokens}, providers order: ${JSON.stringify(providersOrder)}`)
		environment.log.info(`Input used: ${validInput}`)

		const promptTemplate = `You are a professional formatter. Polish the following legal draft into a clean, professional document ready for export:
            ---
            ${validInput}
            `

		const jsonResult = await callStructuredLLMwithJSON(
			{},
			{
				model,
				temperature,
				schema: userSchema,
				promptTemplate,
				inputVariables: [],
			}
		)

		if (!jsonResult.success) {
			throw new Error(jsonResult.error || "Failed to generate content")
		}

		if (!jsonResult.data) {
			throw new Error("AI response contained no data")
		}

		environment.setOutput("AI Response", JSON.stringify(jsonResult.data))
		environment.log.info("Polishing process completed successfully")

		return true
	} catch (error: any) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
		environment.log.error(`Draft generation failed: ${errorMessage}`)


		return false
	}
}
