import { Environment, ExecutionEnvironment } from "@/types/executor"
import { TextSummarizeTask } from "../../task/text-operations/TextSummarizeTask"
import { TextElaboratorTask } from "../../task/text-operations/TextElaboratorTask"



export async function textElaboratorExecutor(environment: ExecutionEnvironment<typeof TextElaboratorTask>) {
	try {
		const input = environment.getInput("input")
		const level = environment.getInput("level")
		environment.log.info("Input received")
		console.log(input, level)

		const model = environment.getSetting("Model")
		const temperature = parseInt(environment.getSetting("Temperature"))
		const maxTokens = parseInt(environment.getSetting("Max Tokens"))
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"))

		environment.log.info("Response is outputted")

		return true
	} catch (error: any) {
		console.log(error)
		environment.log.error(error.message)
		return false
	}
}
