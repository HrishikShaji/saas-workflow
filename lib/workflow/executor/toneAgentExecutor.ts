import { Environment, ExecutionEnvironment } from "@/types/executor"
import { getAIResponse } from "../ai/getAIResponse"
import { ToneAgentTask } from "../task/ToneAgent"
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse"

export async function toneAgentExecutor(environment: ExecutionEnvironment<typeof ToneAgentTask>) {
	try {
		environment.log.info("Starting tone improving process")
		const input = environment.getInput("AI Generated Content")
		const tone = environment.getInput("Tone")

		environment.log.info("Sending request to OpenAI")

		const systemMessage = "You are a language expert"
		const query = `Adjust the tone of the following legal draft to be ${tone}
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
