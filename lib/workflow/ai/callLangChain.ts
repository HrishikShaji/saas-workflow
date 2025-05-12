import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

const responseSchema = z.object({
	greeting: z.string().describe("A friendly greeting"),
	emotion: z.string().describe("The emotion conveyed").optional(),
	followUpQuestion: z.string().describe("A relevant follow-up question"),
});

export default async function callLangChain() {
	try {
		const parser = StructuredOutputParser.fromZodSchema(responseSchema);
		const prompt = PromptTemplate.fromTemplate(`
      Respond to the user's message in a friendly way.
      The user said: {input}
      
      {format_instructions}
    `);

		// Initialize the chat model
		const chat = new ChatOpenAI({
			model: "gpt-4o",
			temperature: 0.8,
			streaming: true,
			openAIApiKey: process.env.OPEN_ROUTER_API_KEY,
			configuration: {
				baseURL: "https://openrouter.ai/api/v1",
			},
		});

		const chain = prompt.pipe(chat).pipe(parser);

		const structuredResponse = await chain.invoke({
			input: "Hi there",
			format_instructions: parser.getFormatInstructions(),
		});

		console.log("Structured response:", structuredResponse);

		return structuredResponse;
	} catch (error) {
		console.error("Error in callLangChain:", error);
		throw error;
	}
}
