
import { Environment, ExecutionEnvironment } from "@/types/executor"
import { getAIResponse } from "../ai/getAIResponse"
import { OptionsAgentTask } from "../task/OptionsAgent"
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse"

export async function optionsAgentExecutor(environment: ExecutionEnvironment<typeof OptionsAgentTask>) {
	try {
		environment.log.info("Starting clarity improving process")
		const systemMessage = environment.getInput("System Message")
		const prompt = environment.getInput("Prompt")
		const noOfOptions = environment.getInput("No of Options")

		environment.log.info("Sending request to OpenAI")

		const systemMessageTemplate = `${systemMessage}.return only a array of strings ,no additional text.return only ${noOfOptions} items`
		const aiResponse = await getOpenRouterResponse({
			systemMessage: systemMessageTemplate,
			query: prompt
		})
		console.log("this is ai response", aiResponse)
		environment.setOutput("Options", aiResponse)
		environment.log.info("Draft generation completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
