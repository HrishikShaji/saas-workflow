import { Environment, EnvironmentDatabase, ExecutionEnvironment } from "@/types/executor";
import { DatabaseOperatorTask } from "../task/DatabaseOperator";
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse";
import { models, providersOrder } from "@/lib/constants";
import { Db } from "mongodb";

async function getCollectionFields(db: Db, collectionName: string): Promise<string[]> {
	try {
		const collection = db.collection(collectionName);
		const sampleDoc = await collection.findOne({}, { projection: { _id: 0 } });
		collection.find({}, {})
		if (!sampleDoc) return [];

		const fields = new Set<string>();
		extractFieldPaths(sampleDoc, '', fields);
		return Array.from(fields).sort();
	} catch (error) {
		console.error(`Error analyzing fields for ${collectionName}:`, error);
		return [];
	}
}

function extractFieldPaths(doc: any, prefix: string, fields: Set<string>): void {
	for (const [key, value] of Object.entries(doc)) {
		const fullPath = prefix ? `${prefix}.${key}` : key;

		if (value && typeof value === 'object' && !Array.isArray(value)) {
			extractFieldPaths(value, fullPath, fields);
		} else {
			fields.add(fullPath);
		}
	}
}

function parseLLMResponse(response: string) {
	try {
		const cleanResponse = response.replace(/```(?:json)?|```/g, '').trim();
		return JSON.parse(cleanResponse);
	} catch (e: any) {
		throw new Error(`Failed to parse LLM response: ${e.message}`);
	}
}
export async function databaseOperatorExecutor(
	environment: ExecutionEnvironment<typeof DatabaseOperatorTask>
) {
	const { instance } = environment.getDatabase() as EnvironmentDatabase;

	if (!instance?.db) {
		environment.log.error(`No Database instance found`);
		return false;
	}

	try {
		const prompt = environment.getInput("query");

		const collections = await instance.db.collections();
		const collectionNames = collections.map(c => c.collectionName);

		const completeSchemas = await Promise.all(
			collectionNames.map(async name => ({
				collectionName: name,
				fields: await getCollectionFields(instance.db as Db, name)
			}))
		);


		const systemMessage = `You are a MongoDB expert assistant. Your task is to generate precise MongoDB queries based on user requests.

${JSON.stringify(completeSchemas)}
 Respond ONLY with JSON in this exact format:
{
  "collectionName": "name_of_collection",
  "fields": ["field1", "field2", "nested.field"],
"query":"query for the db.collection.find method",
"projection":"projection for the db.collection.find method",
"options":"projection for the db.collection.find method"
}

Rules:
1. ONLY return valid JSON
2. Use the actual collection names from the database
3. Include ALL fields from the sample document
4. Maintain the exact field naming (case-sensitive)
5. Preserve nested field paths with dots
6. Never add explanations or other text`;

		const aiResponse = await getOpenRouterResponse({
			systemMessage,
			query: prompt,
			model: models[0],
			temperature: 0.3,
			maxTokens: 500,
			providersOrder: providersOrder

		})

		console.log("this is ai response", aiResponse)

		const { collectionName, fields, query, projection, options } = parseLLMResponse(aiResponse);

		console.log("these are responses", query, projection, options)
		const collection = instance.db.collection(collectionName);

		const parsedQuery = typeof query === "string" ? JSON.parse(query) : query;
		const parsedProjection = typeof projection === "string" ? JSON.parse(projection) : projection;
		const parsedOptions = typeof options === "string" ? JSON.parse(options) : options;

		const result = await collection.find(parsedQuery, { ...parsedProjection, ...parsedOptions }).toArray()
		console.log("result", result)

		environment.setOutput("Response", JSON.stringify(result));

		environment.log.info(`${collectionName} successfully fetched`);
		return true;

	} catch (error: any) {
		environment.log.error(`Database operation failed: ${error.message}`);
		console.error(error);
		return false;
	}
}

