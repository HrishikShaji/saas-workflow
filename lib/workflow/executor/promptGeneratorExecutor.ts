import { Environment, ExecutionEnvironment } from "@/types/executor"
import { PromptGeneratorTask } from "../task/PromptGenerator"
import { getAIResponse } from "../ai/getAIResponse"
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse"

export async function promptGeneratorExecutor(environment: ExecutionEnvironment<typeof PromptGeneratorTask>) {
	try {
		console.log("launch browser executed @@ENV", JSON.stringify(environment, null, 4))
		const input = environment.getInput("input")
		const useCase = environment.getInput("use case")
		const settings = environment.getSetting("Model")
		console.log("@@SETTINGS", settings)
		environment.log.info("Input received")


		const aiResponse = await getOpenRouterResponse({
			systemMessage: `You are an agent who improves Prompts to get most out of an LLM with context ${useCase}.only return the improved prompt no additional text`,
			query: input
		})
		environment.setOutput("AI Response", aiResponse)
		environment.log.info(`Response is outputted`)

		return true
	} catch (error: any) {
		environment.log.error(error.message)
		return false
	}
}
