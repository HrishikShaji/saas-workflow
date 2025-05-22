import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

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
			`${options.promptTemplate}\n\n{format_instructions}\n\nIMPORTANT: Return ONLY the actual data as a simple JSON object matching the schema, without any additional schema information, markdown formatting, code blocks, or explanations. Just return the raw JSON data.`
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
		//		console.log("@@RESPONSE", response.content)

		{/*
		let finalResponse: string;

		try {
			const parsed = JSON.parse(response.content as string)
			//	console.log("@@PARSED", parsed.properties)
			finalResponse = JSON.stringify(parsed.properties)
		} catch (err) {
			console.error(err)
			throw err
		}
	*/}

		return {
			success: true,
			data: response.content,
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
