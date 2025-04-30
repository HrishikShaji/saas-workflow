import { Environment, ExecutionEnvironment } from "@/types/executor"
import { DraftGeneratorTask } from "../task/DraftGenerator"
import { getAIResponse } from "../ai/getAIResponse"

export async function draftGeneratorExecutor(environment: ExecutionEnvironment<typeof DraftGeneratorTask>) {
	try {
		environment.log.info("Starting draft generation process")
		const input = environment.getInput("AI Generated Content")

		environment.log.info("Sending request to OpenAI")

		const aiResponse = await getAIResponse({
			systemMessage: "You are a helpful assistant that generates high-quality drafts based on provided input.",
			query: `Please generate a comprehensive draft based on the following input: ${input}`
		})
		environment.setOutput("AI Response", aiResponse)
		environment.log.info("Draft generation completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
