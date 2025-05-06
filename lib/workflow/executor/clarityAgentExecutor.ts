import { Environment, ExecutionEnvironment } from "@/types/executor"
import { getAIResponse } from "../ai/getAIResponse"
import { ClarityAgentTask } from "../task/ClarityAgent"
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse"

export async function clarityGeneratorExecutor(environment: ExecutionEnvironment<typeof ClarityAgentTask>) {
	try {
		environment.log.info("Starting clarity improving process")
		const input = environment.getInput("AI Generated Content")
		const model = environment.getSetting("Model")
		const temperature = parseInt(environment.getSetting("Temperature"))
		const maxTokens = parseInt(environment.getSetting("Max Tokens"))
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"))

		environment.log.info(`Sending request to ${model},temperature:${temperature},max tokens:${maxTokens},providers order:${JSON.stringify(providersOrder)}`)


		const systemMessage = "You are an editor"
		const query = `Simplify and clarify the following legal draft while keeping it formal and legally sound:
		---
		${input}
		`
		const aiResponse = await getOpenRouterResponse({
			systemMessage,
			query,
			model,
			temperature,
			maxTokens,
			providersOrder
		})
		environment.setOutput("AI Response", aiResponse)
		environment.log.info("Draft generation completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
