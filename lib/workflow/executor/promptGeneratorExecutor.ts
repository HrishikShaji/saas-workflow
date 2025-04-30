import { Environment, ExecutionEnvironment } from "@/types/executor"
import puppeteer from "puppeteer"
import { PromptGeneratorTask } from "../task/PromptGenerator"

export async function promptGeneratorExecutor(environment: ExecutionEnvironment<typeof PromptGeneratorTask>) {
	try {
		console.log("launch browser executed @@ENV", JSON.stringify(environment, null, 4))
		const input = environment.getInput("input")
		environment.log.info("Input received")

		const aiResponse = `For this ${input} ,response is ${input}`
		environment.setOutput("AI Response", aiResponse)
		environment.log.info(`Response is outputted`)

		return true
	} catch (error: any) {
		environment.log.error(error.message)
		return false
	}
}
