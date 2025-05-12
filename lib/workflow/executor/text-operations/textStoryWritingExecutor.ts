import { ExecutionEnvironment } from "@/types/executor";
import { getOpenRouterResponse } from "../../ai/getOpenRouterResponse";
import { TextStoryWritingTask } from "../../task/text-operations/TextStoryWritingTask";

export async function textStoryWritingExecutor(environment: ExecutionEnvironment<typeof TextStoryWritingTask>) {
	try {
		const contentType = environment.getInput("contentType");
		const genre = environment.getInput("genre");
		const premise = environment.getInput("premise");
		const length = environment.getInput("length") || "medium";
		const tone = environment.getInput("tone");
		const characterDescriptions = JSON.parse(environment.getInput("characterDescriptions") || "[]");

		const model = environment.getSetting("Model");
		const temperature = parseFloat(environment.getSetting("Temperature"));
		const maxTokens = parseInt(environment.getSetting("Max Tokens"));
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"));

		let systemMessage: string;
		let query: string;

		if (contentType === "story") {
			const pointOfView = environment.getInput("pointOfView") || "third";
			systemMessage = `You are a professional storyteller. Create engaging narratives that:
      1. Have compelling characters and dialogue
      2. Follow proper story structure
      3. Maintain ${tone || 'appropriate'} tone
      4. Show rather than tell
      5. Use ${pointOfView}-person point of view`;

			query = `Write a ${length} ${genre} story with this premise: ${premise}\n`;
			if (characterDescriptions.length) {
				query += `Characters:\n${characterDescriptions.join('\n')}\n`;
			}
		} else { // script
			const format = environment.getInput("format") || "screenplay";
			systemMessage = `You are a professional screenwriter. Create a ${format} script that:
      1. Follows proper ${format} formatting
      2. Has compelling dialogue and action
      3. Maintains ${tone || 'appropriate'} tone
      4. Includes clear scene descriptions`;

			query = `Write a ${length} ${format} in the ${genre} genre.\n`;
			query += `Premise: ${premise}\n`;
			if (characterDescriptions.length) {
				query += `Characters:\n${characterDescriptions.join('\n')}\n`;
			}
		}

		const content = await getOpenRouterResponse({
			systemMessage,
			query,
			model,
			temperature,
			maxTokens,
			providersOrder
		});

		environment.setOutput("AI Response", content);
		environment.log.info("Story/script generated successfully");
		return true;
	} catch (error: any) {
		environment.log.error(`Story/script creation failed: ${error.message}`);
		return false;
	}
}
