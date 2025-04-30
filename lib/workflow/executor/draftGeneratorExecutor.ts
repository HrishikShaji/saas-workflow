
import { Environment, ExecutionEnvironment } from "@/types/executor"
import { PromptGeneratorTask } from "../task/PromptGenerator"
import { DraftGeneratorTask } from "../task/DraftGenerator"

export async function draftGeneratorExecutor(environment: ExecutionEnvironment<typeof DraftGeneratorTask>) {
	try {
		console.log("launch browser executed @@ENV", JSON.stringify(environment, null, 4))
		const input = environment.getInput("AI Generated Content")
		environment.log.info("Input received")

		const aiResponse = `For this ${input} ,final response is ${input}`
		environment.setOutput("AI Response", aiResponse)
		environment.log.info(`Response is outputted`)

		return true
	} catch (error: any) {
		environment.log.error(error.message)
		return false
	}
}
