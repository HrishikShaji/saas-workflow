import { Environment, ExecutionEnvironment } from "@/types/executor"
import { getAIResponse } from "../ai/getAIResponse"
import { ClarityAgentTask } from "../task/ClarityAgent"
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse"

export async function clarityGeneratorExecutor(environment: ExecutionEnvironment<typeof ClarityAgentTask>) {
	try {
		environment.log.info("Starting clarity improving process")
		const input = environment.getInput("AI Generated Content")

		environment.log.info("Sending request to OpenAI")

		const systemMessage = "You are an editor"
		const query = `Simplify and clarify the following legal draft while keeping it formal and legally sound:
		---
		${input}
		`
		const aiResponse = await getOpenRouterResponse({
			systemMessage,
			query
		})
		environment.setOutput("AI Response", aiResponse)
		environment.log.info("Draft generation completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
