import { Environment, ExecutionEnvironment } from "@/types/executor"
import { TextFormatConverterTask } from "../../task/text-operations/TextFormatConverter"



export async function textFormatConverterExecutor(environment: ExecutionEnvironment<typeof TextFormatConverterTask>) {
	try {
		const input = environment.getInput("input")
		const format = environment.getInput("format")
		environment.log.info("Input received")
		console.log(input, format)

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
