
import { Environment, ExecutionEnvironment } from "@/types/executor"
import { TextParaphrasingTask } from "../../task/text-operations/TextParaphrasingTask"
import { getOpenRouterResponse } from "../../ai/getOpenRouterResponse";



export async function textParaphrasingExecutor(environment: ExecutionEnvironment<typeof TextParaphrasingTask>) {
	try {
		const input = environment.getInput("input");
		const diversity = parseFloat(environment.getInput("diversity")); // Expecting 0-1
		environment.log.info("Input received");

		const clampedDiversity = Math.min(Math.max(diversity, 0), 1);

		const model = environment.getSetting("Model");
		const baseTemperature = parseFloat(environment.getSetting("Temperature"));
		const maxTokens = parseInt(environment.getSetting("Max Tokens"));
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"));

		const effectiveTemperature = baseTemperature * (0.7 + clampedDiversity * 0.6);

		let systemMessage: string;
		if (clampedDiversity < 0.4) {
			systemMessage = `You are an AI paraphrasing assistant. Rewrite the text with minimal changes, preserving structure and wording while making slight variations. Use synonyms and minor grammatical adjustments.`;
		} else if (clampedDiversity < 0.8) {
			systemMessage = `You are an AI paraphrasing assistant. Paraphrase the text with moderate changes, balancing original meaning with varied expression. Restructure sentences and use synonyms where appropriate.`;
		} else {
			systemMessage = `You are an AI paraphrasing assistant. Completely rephrase the text with high creativity, using different structures and expressions while keeping the core meaning. Make it substantially different but equally clear.`;
		}

		const paraphrasedText = await getOpenRouterResponse({
			systemMessage,
			query: input,
			model,
			temperature: effectiveTemperature,
			maxTokens,
			providersOrder,
		});

		environment.setOutput("AI Response", paraphrasedText);
		environment.log.info("Text paraphrased successfully");
		return true;
	} catch (error: any) {
		console.error(error);
		environment.log.error(error.message);
		return false;
	}
}
