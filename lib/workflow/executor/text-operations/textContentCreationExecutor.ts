import { ExecutionEnvironment } from "@/types/executor";
import { TextContentCreationTask } from "../../task/text-operations/TextContentCreationTask";
import { z } from "zod";
import { callStructuredLLM } from "../../ai/callStructuredLLM";
import { jsonSchemaToZod } from "json-schema-to-zod"
import { env } from "@huggingface/transformers";
import { callStructuredLLMwithJSON } from "../../ai/callStructuredLLMwithJSON";

// Define your output schema
const contentResponseSchema = z.object({
	title: z.string().describe("The title of the generated content"),
	introduction: z.string().describe("Engaging introduction paragraph"),
	body: z.array(
		z.object({
			heading: z.string().describe("Section heading"),
			content: z.string().describe("Section content"),
		})
	).describe("Main content sections with headings"),
	conclusion: z.string().describe("Strong concluding paragraph"),
	tone: z.string().describe("The tone used in the content").optional(),
	wordCount: z.number().describe("Approximate word count").optional(),
});

const jsonSchema = {
	"$schema": "http://json-schema.org/draft-07/schema#",
	"type": "object",
	"properties": {
		"title": {
			"type": "string",
			"description": "The title of the generated content"
		},
		"introduction": {
			"type": "string",
			"description": "Engaging introduction paragraph"
		},
		"body": {
			"type": "array",
			"description": "Main content sections with headings",
			"items": {
				"type": "object",
				"properties": {
					"heading": {
						"type": "string",
						"description": "Section heading"
					},
					"content": {
						"type": "string",
						"description": "Section content"
					}
				},
				"required": ["heading", "content"],
				"additionalProperties": false
			}
		},
		"conclusion": {
			"type": "string",
			"description": "Strong concluding paragraph"
		},
		"tone": {
			"type": "string",
			"description": "The tone used in the content"
		},
		"wordCount": {
			"type": "number",
			"description": "Approximate word count"
		}
	},
	"required": ["title", "introduction", "body", "conclusion"],
	"additionalProperties": false
}

export async function textContentCreationExecutor(
	environment: ExecutionEnvironment<typeof TextContentCreationTask>
) {
	try {
		const topic = environment.getInput("topic");
		const contentType = environment.getInput("contentType");
		const length = environment.getInput("length") || "medium";
		const style = environment.getInput("style") || "journalistic";
		const audience = environment.getInput("audience");

		const model = environment.getSetting("Model");
		const temperature = parseFloat(environment.getSetting("Temperature"));
		const maxTokens = parseInt(environment.getSetting("Max Tokens"));
		const schemaString = environment.getSetting("Schema")
		//console.log("this is schema", schemaString)

		const userSchema = JSON.parse(schemaString)

		//console.log("Actual Zod schema instance:", zodSchema);

		// Build the prompt template based on content type
		let promptTemplate: string;
		let inputVariables: string[] = ["topic", "length", "style", "audience"];

		if (contentType === "article") {
			promptTemplate = `
        You are a professional content creator specializing in high-quality articles.
        Create a {length}-length {style} article about "{topic}" for {audience}.
        
        Requirements:
        1. Include a compelling title
        2. Write an engaging introduction
        3. Structure the body with clear sections
        4. End with a strong conclusion
        5. Maintain perfect grammar and style
        
      `;
		} else {
			promptTemplate = `
        You are a professional report writer.
        Create a {length}-length {style} report about "{topic}" for {audience}.
        
        Requirements:
        1. Include a professional title
        2. Provide an executive summary
        3. Structure the body with clear sections
        4. Include data-driven insights where applicable
        5. End with actionable recommendations
        
      `;
		}


		environment.log.info(`calling ${model}`);
		const result = await callStructuredLLM(
			{
				topic,
				length,
				style,
				audience: audience || (contentType === "article" ? "general readers" : "business stakeholders"),
			},
			{
				model,
				temperature,
				schema: contentResponseSchema,
				promptTemplate,
				inputVariables,
			}
		);

		const jsonResult = await callStructuredLLMwithJSON(
			{
				topic,
				length,
				style,
				audience: audience || (contentType === "article" ? "general readers" : "business stakeholders"),
			},
			{
				model,
				temperature,
				schema: jsonSchema,
				promptTemplate,
				inputVariables,
			}
		);
		//		console.log("@@JSONRESULT", jsonResult)
		//		console.log("@@RESULT", result)

		if (!result.success) {
			throw new Error(result.error || "Failed to generate content");
		}

		// Format the structured output for your system

		if (!result.data) {
			environment.log.error("no data")
			return false
		}
		environment.setOutput("AI Response", jsonResult.data);
		environment.log.info("Content generated successfully");
		return true;
	} catch (error: any) {
		environment.log.error(`Content creation failed: ${error.message}`);
		return false;
	}
}


