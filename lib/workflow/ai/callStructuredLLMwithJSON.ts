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

		// Update the prompt template to explicitly request valid JSON without Markdown formatting
		const prompt = PromptTemplate.fromTemplate(
			`${options.promptTemplate}\n\n{format_instructions}\n\nIMPORTANT: Return ONLY the JSON output without any markdown code blocks, explanations, or backticks. Ensure all quotes are double quotes, not backticks.`
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

		const chain = prompt.pipe(llm)


		const response = await chain.invoke({
			...inputData,
			format_instructions: parser.getFormatInstructions(),
		});
		console.log("@@RESPONSE", response.content)

		let finalResponse;

		try {
			const parsed = JSON.parse(response.content as string)
			console.log("@@PARSED", parsed.properties)
			finalResponse = JSON.stringify(parsed.properties)
		} catch (err) {
			throw err
		}

		return {
			success: true,
			data: finalResponse,
			error: null,
		};
	} catch (error) {
		console.error("Full error:", error);
		return {
			success: false,
			data: null,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}
