import { Db } from "mongodb";

interface Props {
	db: Db;
	aiResponse: string;
}

function parseLLMResponse(response: string) {
	try {
		const cleanResponse = response.replace(/```(?:json)?|```/g, '').trim();
		return JSON.parse(cleanResponse);
	} catch (e: any) {
		throw new Error(`Failed to parse LLM response: ${e.message}`);
	}
}

export async function getMongDBItemsInCollection({ db, aiResponse }: Props) {

	const { collectionName, fields, query, projection, options } = parseLLMResponse(aiResponse);

	console.log("these are responses", query, projection, options)
	const collection = db.collection(collectionName);

	const parsedQuery = typeof query === "string" ? JSON.parse(query) : query;
	const parsedProjection = typeof projection === "string" ? JSON.parse(projection) : projection;
	const parsedOptions = typeof options === "string" ? JSON.parse(options) : options;

	const result = await collection.find(parsedQuery, { ...parsedProjection, ...parsedOptions }).toArray()
	console.log("result", result)

	return result
}
