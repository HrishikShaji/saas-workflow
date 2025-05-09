
import { Environment, ExecutionEnvironment } from "@/types/executor"
import { TextSummarizeTask } from "../../task/text-operations/TextSummarizeTask"
import { TextParaphrasingTask } from "../../task/text-operations/TextParaphrasingTask"



export async function textParaphrasingExecutor(environment: ExecutionEnvironment<typeof TextParaphrasingTask>) {
	try {
		const input = environment.getInput("input")
		const diversity = environment.getInput("diversity")
		environment.log.info("Input received")
		console.log(input, diversity)

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
