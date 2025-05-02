import { Environment, ExecutionEnvironment } from "@/types/executor"
import { getAIResponse } from "../ai/getAIResponse"
import { RiskReviewAgentTask } from "../task/RiskReviewAgent"
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse"

export async function riskReviewAgentExecutor(environment: ExecutionEnvironment<typeof RiskReviewAgentTask>) {
	try {
		environment.log.info("Starting risk review process")
		const input = environment.getInput("AI Generated Content")

		environment.log.info("Sending request to OpenAI")

		const systemMessage = "You are a legal risk analyst"
		const query = `Review the draft below for risks like missing protections,liability issues,unenforceable clauses.
                suggest improvements and rewrite necessary parts:
                ---
                ${input}
                `
		const aiResponse = await getOpenRouterResponse({
			systemMessage,
			query
		})
		environment.setOutput("AI Response", aiResponse)
		environment.log.info("Risk Review completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
