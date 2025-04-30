import { Environment, ExecutionEnvironment } from "@/types/executor"
import { getAIResponse } from "../ai/getAIResponse"
import { ComplianceAgentTask } from "../task/ComplianceAgent"

export async function complianceAgentExecutor(environment: ExecutionEnvironment<typeof ComplianceAgentTask>) {
	try {
		environment.log.info("Starting compliance process")
		const input = environment.getInput("AI Generated Content")

		environment.log.info("Sending request to OpenAI")

		const aiResponse = await getAIResponse({
			systemMessage: "You are a helpful assistant that check compliance in a legal document.",
			query: `Please generate a compliant document based on the following input: ${input}`
		})
		environment.setOutput("AI Response", aiResponse)
		environment.log.info("Compliance checking completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
