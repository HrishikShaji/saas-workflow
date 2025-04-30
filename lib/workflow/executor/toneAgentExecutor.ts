import { Environment, ExecutionEnvironment } from "@/types/executor"
import { getAIResponse } from "../ai/getAIResponse"
import { ToneAgentTask } from "../task/ToneAgent"

export async function toneAgentExecutor(environment: ExecutionEnvironment<typeof ToneAgentTask>) {
	try {
		environment.log.info("Starting tone improving process")
		const input = environment.getInput("AI Generated Content")

		environment.log.info("Sending request to OpenAI")

		const aiResponse = await getAIResponse({
			systemMessage: "You are a helpful assistant makes a document more friendly and casual.",
			query: `Please generate a friendly and casual draft based on the following input: ${input}`
		})
		environment.setOutput("AI Response", aiResponse)
		environment.log.info("Draft generation completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
