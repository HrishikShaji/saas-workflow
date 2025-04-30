import { Environment, ExecutionEnvironment } from "@/types/executor"
import { getAIResponse } from "../ai/getAIResponse"
import { ClarityAgentTask } from "../task/ClarityAgent"

export async function clarityGeneratorExecutor(environment: ExecutionEnvironment<typeof ClarityAgentTask>) {
	try {
		environment.log.info("Starting clarity improving process")
		const input = environment.getInput("AI Generated Content")

		environment.log.info("Sending request to OpenAI")

		const aiResponse = await getAIResponse({
			systemMessage: "You are a helpful assistant makes a document in more clarity,makes it easy to read but formal.",
			query: `Please generate a clarity draft based on the following input: ${input}`
		})
		environment.setOutput("AI Response", aiResponse)
		environment.log.info("Draft generation completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
