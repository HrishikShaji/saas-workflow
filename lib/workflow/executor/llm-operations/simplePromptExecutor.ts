import { Environment, ExecutionEnvironment } from "@/types/executor"
import { SimplePromptTask } from "../../task/llm-operations/SimplePromptTask"
import parseSettings from "../lib/parseSettings"
import { callStructuredLLMwithJSON } from "../../ai/callStructuredLLMwithJSON"

export async function simplePromptExecutor(environment: ExecutionEnvironment<typeof SimplePromptTask>) {
	try {
		const prompt = environment.getInput("prompt")
		const { model, userSchema, temperature, maxTokens, providersOrder } = parseSettings(environment)

		environment.log.info(`Sending request to ${model}, temperature: ${temperature}, max tokens: ${maxTokens}, providers order: ${JSON.stringify(providersOrder)}`)

		console.log("@@USERSCHEMA", userSchema)

		const jsonResult = await callStructuredLLMwithJSON(
			{},
			{
				model,
				temperature,
				schema: userSchema,
				promptTemplate: prompt,
				inputVariables: [],
			}
		)

		if (!jsonResult.success) {
			throw new Error(jsonResult.error || "Failed to generate content")
		}

		if (!jsonResult.data) {
			throw new Error("AI response contained no data")
		}

		environment.setOutput("Response", JSON.stringify(jsonResult.data))
		environment.log.info("Polishing process completed successfully")

		return true
	} catch (error: any) {
		console.log(error)
		environment.log.error(error.message)
		return false
	}
}
