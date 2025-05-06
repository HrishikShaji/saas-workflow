import { Environment, ExecutionEnvironment } from "@/types/executor"
import { getAIResponse } from "../ai/getAIResponse"
import { ComplianceAgentTask } from "../task/ComplianceAgent"
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse"

export async function complianceAgentExecutor(environment: ExecutionEnvironment<typeof ComplianceAgentTask>) {
	try {
		environment.log.info("Starting compliance process")
		const input = environment.getInput("AI Generated Content")
		const law = environment.getInput("Law")

		const model = environment.getSetting("Model")
		console.log("@@MODEL", model)

		environment.log.info(`Sending request to ${model}`)

		const systemMessage = "You are a compliance checker"
		const query = `Review the following legal draft for compliance with ${law}.
		Fix any missing mandatory clauses or legal issues:
		---
		${input}
		`
		const aiResponse = await getOpenRouterResponse({
			systemMessage,
			query,
			model
		})
		environment.setOutput("AI Response", aiResponse)
		environment.log.info("Compliance checking completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
