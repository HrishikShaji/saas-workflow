import { ExecutionEnvironment } from "@/types/executor";
import { getOpenRouterResponse } from "../../ai/getOpenRouterResponse";
import { TextContentCreationTask } from "../../task/text-operations/TextContentCreationTask";

export async function textContentCreationExecutor(environment: ExecutionEnvironment<typeof TextContentCreationTask>) {
	try {
		const topic = environment.getInput("topic");
		const contentType = environment.getInput("contentType");
		const length = environment.getInput("length") || "medium";
		const style = environment.getInput("style") || "journalistic";
		const audience = environment.getInput("audience");

		const model = environment.getSetting("Model");
		const temperature = parseFloat(environment.getSetting("Temperature"));
		const maxTokens = parseInt(environment.getSetting("Max Tokens"));
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"));

		let systemMessage: string;
		let query: string;

		if (contentType === "article") {
			systemMessage = `You are a professional content creator specializing in high-quality articles. 
      Follow these guidelines:
      1. Structure content with clear headings and logical flow
      2. Use ${style} tone
      3. Support claims with evidence when possible
      4. Maintain perfect grammar and style
      5. Target audience: ${audience || 'general readers'}`;

			query = `Write a ${length}-length article about "${topic}"`;
		} else { // report
			//const sections = JSON.parse(environment.getInput("sections"));
			systemMessage = `You are a professional report writer. Create a well-structured ${style} report with:
      1. Clear section organization
      2. Professional tone
      3. Data-driven insights where applicable
      4. Target audience: ${audience || 'business stakeholders'}`;

			//query = `Create a ${length} report on "${topic}" with these sections:\n${sections.join('\n')}`;
			query = `Create a ${length} report on "${topic}" `;
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
		environment.log.info("Content generated successfully");
		return true;
	} catch (error: any) {
		environment.log.error(`Content creation failed: ${error.message}`);
		return false;
	}
}
