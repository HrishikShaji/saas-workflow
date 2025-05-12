import { ExecutionEnvironment } from "@/types/executor";
import { getOpenRouterResponse } from "../../ai/getOpenRouterResponse";
import { TextTemplateFillingTask } from "../../task/text-operations/TextTemplateFillingTask";

export async function textTemplateFillingExecutor(environment: ExecutionEnvironment<typeof TextTemplateFillingTask>) {
	try {
		const template = environment.getInput("template");
		const instructions = environment.getInput("instructions");
		const examples = environment.getInput("examples"); // JSON string

		const model = environment.getSetting("Model");
		const temperature = parseFloat(environment.getSetting("Temperature"));
		const maxTokens = parseInt(environment.getSetting("Max Tokens"));
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"));

		const systemMessage = `You are an expert at filling templates with precise information. 
    Follow these rules:
    1. Strictly adhere to the provided template structure
    2. Only fill in the requested information, don't modify the template
    3. Maintain consistent formatting
    4. If a field can't be filled, use [DATA NOT AVAILABLE]
    5. Never add extra content outside the template`;

		let query = `Fill in the following template according to these instructions: ${instructions}\n\n`;

		if (examples) {
			const parsedExamples = JSON.parse(examples);
			query += `Examples:\n`;
			parsedExamples.forEach((ex: any, i: number) => {
				query += `Example ${i + 1} Context: ${ex.context}\n`;
				query += `Filled Template: ${ex.filledTemplate}\n\n`;
			});
		}

		query += `Template to fill:\n${template}`;

		const filledTemplate = await getOpenRouterResponse({
			systemMessage,
			query,
			model,
			temperature,
			maxTokens,
			providersOrder
		});

		environment.setOutput("AI Response", filledTemplate);
		environment.log.info("Template filled successfully");
		return true;
	} catch (error: any) {
		environment.log.error(`Template filling failed: ${error.message}`);
		return false;
	}
}
