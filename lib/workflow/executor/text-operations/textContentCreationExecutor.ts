import { ExecutionEnvironment } from "@/types/executor";
import { TextContentCreationTask } from "../../task/text-operations/TextContentCreationTask";
import { z } from "zod";
import { callStructuredLLM } from "../../ai/callStructuredLLM";
import { jsonSchemaToZod } from "json-schema-to-zod"

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

		const schemaObj = JSON.parse(schemaString)
		const zodSchemaString = jsonSchemaToZod(schemaObj);
		//console.log("schema string", zodSchemaString);

		// Wrap the schema in a self-executing function that receives z
		const wrappedSchemaFn = `(function(z) { return ${zodSchemaString} })`;
		const createSchema = eval(wrappedSchemaFn);
		const zodSchema = createSchema(z);

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
        
        {format_instructions}
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
        
        {format_instructions}
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

		console.log("@@RESULT", result)

		if (!result.success) {
			throw new Error(result.error || "Failed to generate content");
		}

		// Format the structured output for your system
		const formattedContent = formatContent(result.data, contentType);

		environment.setOutput("AI Response", formattedContent);
		environment.log.info("Content generated successfully");
		return true;
	} catch (error: any) {
		environment.log.error(`Content creation failed: ${error.message}`);
		return false;
	}
}

// Helper function to format the structured output
function formatContent(data: z.infer<typeof contentResponseSchema>, contentType: string): string {
	if (contentType === "article") {
		return `# ${data.title}\n\n${data.introduction}\n\n${data.body.map(s => `## ${s.heading}\n\n${s.content}`).join('\n\n')
			}\n\n${data.conclusion}`;
	} else {
		return `REPORT: ${data.title}\n\nEXECUTIVE SUMMARY:\n${data.introduction}\n\n${data.body.map(s => `SECTION: ${s.heading}\n\n${s.content}`).join('\n\n')
			}\n\nCONCLUSIONS & RECOMMENDATIONS:\n${data.conclusion}`;
	}
}
