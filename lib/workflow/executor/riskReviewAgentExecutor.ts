import { Environment, ExecutionEnvironment } from "@/types/executor"
import { getAIResponse } from "../ai/getAIResponse"
import { RiskReviewAgentTask } from "../task/RiskReviewAgent"

export async function riskReviewAgentExecutor(environment: ExecutionEnvironment<typeof RiskReviewAgentTask>) {
	try {
		environment.log.info("Starting risk review process")
		const input = environment.getInput("AI Generated Content")

		environment.log.info("Sending request to OpenAI")

		const aiResponse = await getAIResponse({
			systemMessage: "You are a risk review agent that analyses a document and create Risk scoring for each clause.",
			query: `Please do Risk review for : ${input}`
		})
		environment.setOutput("AI Response", aiResponse)
		environment.log.info("Risk Review completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
