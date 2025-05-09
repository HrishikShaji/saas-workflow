import { Environment, ExecutionEnvironment } from "@/types/executor"
import { TextSummarizeTask } from "../../task/text-operations/TextSummarizeTask"
import { TextTranslatorTask } from "../../task/text-operations/TextTranslatorTask"



export async function textTranslatorExecutor(environment: ExecutionEnvironment<typeof TextTranslatorTask>) {
	try {
		const input = environment.getInput("input")
		const targetLanguage = environment.getInput("target language")
		environment.log.info("Input received")
		console.log(input, targetLanguage)

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
