import { Environment, ExecutionEnvironment } from "@/types/executor"
import { SimplePromptTask } from "../../task/llm-operations/SimplePromptTask"
import parseSettings from "../lib/parseSettings"
import { callStructuredLLMwithJSON } from "../../ai/callStructuredLLMwithJSON"

const sampleSchema = {
	"title": "title of the content",
	"geoUrl": "The correct geo url for the prompt from jsDelivr json file that can be used in react-simple-maps library",
	"geoJson": {},
	"data": [
		{
			"id": "",
			"state": "",
			"income": ""
		}
	]
}

export async function simplePromptExecutor(environment: ExecutionEnvironment<typeof SimplePromptTask>) {
	try {
		const prompt = environment.getInput("prompt")
		const { model, userSchema, temperature, maxTokens, providersOrder } = parseSettings(environment)

		environment.log.info(`Sending request to ${model}, temperature: ${temperature}, max tokens: ${maxTokens}, providers order: ${JSON.stringify(providersOrder)}`)

		console.log("@@USERSCHEMA", userSchema)

		const promptTemplate = `for the input: ${prompt},include valid full complete geoJSON data that can be shown as accurate map.`
		const jsonResult = await callStructuredLLMwithJSON(
			{},
			{
				model,
				temperature,
				schema: sampleSchema,
				promptTemplate: promptTemplate,
				inputVariables: [],
			}
		)

		if (!jsonResult.success) {
			throw new Error(jsonResult.error || "Failed to generate content")
		}

		if (!jsonResult.data) {
			throw new Error("AI response contained no data")
		}

		console.log("@@FINALDATA", jsonResult.data)

		environment.setOutput("Response", jsonResult.data as string)
		environment.log.info("Polishing process completed successfully")

		return true
	} catch (error: any) {
		console.log(error)
		environment.log.error(error.message)
		return false
	}
}
