import { ExecutionEnvironment } from "@/types/executor";
import { getOpenRouterResponse } from "../../ai/getOpenRouterResponse";
import { TextCodeGenerationTask } from "../../task/text-operations/TextCodeGenerationTask";

export async function textCodeGenerationExecutor(environment: ExecutionEnvironment<typeof TextCodeGenerationTask>) {
	try {
		const task = environment.getInput("task");
		const language = environment.getInput("language");
		const requirements = JSON.parse(environment.getInput("requirements") || "[]");
		const examples = JSON.parse(environment.getInput("examples") || "[]");
		const styleGuide = environment.getInput("styleGuide");

		const model = environment.getSetting("Model");
		const temperature = parseFloat(environment.getSetting("Temperature"));
		const maxTokens = parseInt(environment.getSetting("Max Tokens"));
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"));

		const systemMessage = `You are an expert software developer that generates high-quality code.
    Follow these rules:
    1. Write clean, efficient, and well-commented ${language} code
    2. Use best practices
    3. Include relevant imports/dependencies
    4. ${styleGuide ? `Follow this style guide: ${styleGuide}` : ''}
    5. Highlight any potential gotchas or edge cases`;

		let query = `Write code that ${task}\n`;

		if (requirements.length) {
			query += `Requirements:\n${requirements.join('\n')}\n`;
		}

		if (examples.length) {
			query += `Examples:\n${examples.join('\n')}\n`;
		}

		const code = await getOpenRouterResponse({
			systemMessage,
			query,
			model,
			temperature,
			maxTokens,
			providersOrder
		});

		environment.setOutput("AI Response", code);
		environment.log.info("Code generated successfully");
		return true;
	} catch (error: any) {
		environment.log.error(`Code generation failed: ${error.message}`);
		return false;
	}
}
