import { ExecutionEnvironment } from "@/types/executor";
import { TextContentCreationTask } from "../../task/text-operations/TextContentCreationTask";
import { callStructuredLLMwithJSON } from "../../ai/callStructuredLLMwithJSON";


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
		console.log("@@CONTENTCREATIONSCHEMA", userSchema)
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
        
        
      `;
		}


		environment.log.info(`calling ${model}`);
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
				schema: userSchema,
				promptTemplate,
				inputVariables,
			}
		);
		//		console.log("@@JSONRESULT", jsonResult)
		//		console.log("@@RESULT", result)

		if (!jsonResult.success) {
			throw new Error(jsonResult.error || "Failed to generate content");
		}

		// Format the structured output for your system


		if (!jsonResult.data) {
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


