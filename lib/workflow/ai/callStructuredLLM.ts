import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

interface LLMCallOptions {
	model?: string;
	temperature?: number;
	streaming?: boolean;
	schema: z.ZodSchema<any>;
	promptTemplate: string;
	inputVariables: string[];
}

export async function callStructuredLLM(
	inputData: Record<string, any>,
	options: LLMCallOptions
) {
	try {
		const parser = StructuredOutputParser.fromZodSchema(options.schema);

		const prompt = PromptTemplate.fromTemplate(
			`${options.promptTemplate}\n\n{format_instructions}`
		);

		const chat = new ChatOpenAI({
			model: options.model || "gpt-4o",
			temperature: options.temperature || 0.7,
			streaming: options.streaming || false,
			openAIApiKey: process.env.OPEN_ROUTER_API_KEY,
			configuration: {
				baseURL: "https://openrouter.ai/api/v1",
			},
		});

		const chain = prompt.pipe(chat).pipe(parser);

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
