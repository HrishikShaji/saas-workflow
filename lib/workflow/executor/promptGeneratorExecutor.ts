import { Environment, ExecutionEnvironment } from "@/types/executor"
import { PromptGeneratorTask } from "../task/PromptGenerator"
import { getAIResponse } from "../ai/getAIResponse"
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse"

export async function promptGeneratorExecutor(environment: ExecutionEnvironment<typeof PromptGeneratorTask>) {
	try {
		console.log("launch browser executed @@ENV", JSON.stringify(environment, null, 4))
		const input = environment.getInput("input")
		const useCase = environment.getInput("use case")
		environment.log.info("Input received")
		const model = environment.getSetting("Model")
		console.log("@@MODEL", model)

		environment.log.info(`Sending request to ${model}`)


		const aiResponse = await getOpenRouterResponse({
			systemMessage: `You are an agent who improves Prompts to get most out of an LLM with context ${useCase}.only return the improved prompt no additional text`,
			query: input,
			model
		})
		environment.setOutput("AI Response", aiResponse)
		environment.log.info(`Response is outputted`)

		return true
	} catch (error: any) {
		environment.log.error(error.message)
		return false
	}
}
