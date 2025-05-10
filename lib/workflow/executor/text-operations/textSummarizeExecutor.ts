import { Environment, ExecutionEnvironment } from "@/types/executor"
import { TextSummarizeTask } from "../../task/text-operations/TextSummarizeTask"
import { getOpenRouterResponse } from "../../ai/getOpenRouterResponse"



export async function textSummarizeExecutor(environment: ExecutionEnvironment<typeof TextSummarizeTask>) {
	try {
		const input = environment.getInput("input")
		const mode = environment.getInput("mode")
		environment.log.info("Input received")
		console.log(input, mode)

		const model = environment.getSetting("Model")
		const temperature = parseInt(environment.getSetting("Temperature"))
		const maxTokens = parseInt(environment.getSetting("Max Tokens"))
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"))

		let systemMessage: string;
		if (mode === "abstractive") {
			systemMessage = `You are an advanced AI text summarizer. Generate a concise abstractive summary that captures the key ideas and main points of the provided text in your own words. The summary should be coherent and readable while being significantly shorter than the original.`;
		} else {
			systemMessage = `You are an advanced AI text summarizer. Generate an extractive summary by selecting and combining the most important sentences or phrases from the provided text. Do not paraphrase - use the original wording as much as possible. The summary should be significantly shorter than the original.`;
		}

		const summary = await getOpenRouterResponse({
			systemMessage,
			query: input,
			model,
			temperature,
			maxTokens,
			providersOrder
		});

		environment.setOutput("AI Response", summary)
		environment.log.info("Response is outputted")

		return true
	} catch (error: any) {
		console.log(error)
		environment.log.error(error.message)
		return false
	}
}
