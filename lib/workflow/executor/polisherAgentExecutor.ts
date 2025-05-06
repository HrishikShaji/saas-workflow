
import { Environment, ExecutionEnvironment } from "@/types/executor"
import { getAIResponse } from "../ai/getAIResponse"
import { RiskReviewAgentTask } from "../task/RiskReviewAgent"
import { PolisherAgentTask } from "../task/PolisherAgent"
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse"

export async function polisherAgentExecutor(environment: ExecutionEnvironment<typeof PolisherAgentTask>) {
	try {
		environment.log.info("Starting polishing process")
		const input = environment.getInput("AI Generated Content")

		const model = environment.getSetting("Model")
		console.log("@@MODEL", model)

		environment.log.info(`Sending request to ${model}`)

		const systemMessage = "You are a professional formatter"
		const query = `Polish the following legal draft into a clean, professional document ready for export:
                ---
                ${input}
                `
		const aiResponse = await getOpenRouterResponse({
			systemMessage,
			query,
			model
		})
		environment.setOutput("AI Response", aiResponse)
		environment.log.info("Polishing process completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
