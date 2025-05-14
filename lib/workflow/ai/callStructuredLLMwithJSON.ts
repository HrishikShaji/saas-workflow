import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

interface LLMCallOptions {
	model?: string;
	temperature?: number;
	streaming?: boolean;
	schema: Record<string, any>;
	promptTemplate: string;
	inputVariables: string[];
}

export async function callStructuredLLMwithJSON(
	inputData: Record<string, any>,
	options: LLMCallOptions
) {
	try {
		const parser = StructuredOutputParser.fromNamesAndDescriptions(options.schema);

		const prompt = PromptTemplate.fromTemplate(
			`${options.promptTemplate}\n\n{format_instructions}`
		);

		const llm = new ChatOpenAI({
			model: options.model || "gpt-4o",
			temperature: options.temperature || 0.7,
			streaming: options.streaming || false,
			openAIApiKey: process.env.OPEN_ROUTER_API_KEY,
			configuration: {
				baseURL: "https://openrouter.ai/api/v1",
			},
		});
		const chain = RunnableSequence.from([
			prompt,
			llm,
			parser,
		]);



		const response = await chain.invoke({
			...inputData,
			format_instructions: parser.getFormatInstructions(),
		});

		return {
			success: true,
			data: response,
			error: null,
		};
	} catch (error) {
		return {
			success: false,
			data: null,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}
