import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import OpenAI from "openai"
import { DataAPIClient } from "@datastax/astra-db-ts"

const {
	ASTRA_DB_NAMESPACE,
	ASTRA_DB_COLLECTION,
	ASTRA_DB_API_ENDPOINT,
	ASTRA_DB_APPLICATION_TOKEN,
	OPENAI_API_KEY
} = process.env

const openaiClient = new OpenAI({
	apiKey: OPENAI_API_KEY
})

const openai = createOpenAI({
	apiKey: OPENAI_API_KEY
})

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT || "", {
	namespace: ASTRA_DB_NAMESPACE
})

export async function POST(req: Request) {
	try {
		const { messages } = await req.json()
		const latestMessage = messages[messages.length - 1]?.content
		let docContext = ""

		const embeddingResponse = await openaiClient.embeddings.create({
			model: "text-embedding-3-small",
			input: latestMessage,
			encoding_format: "float"
		})

		const embedding = embeddingResponse.data[0]?.embedding

		try {
			const collection = db.collection(ASTRA_DB_COLLECTION || "")
			const cursor = collection.find({}, {
				sort: {
					$vector: embedding,
				},
				limit: 10
			})

			const documents = await cursor.toArray()
			const docsMap = documents?.map(doc => doc.text)
			docContext = JSON.stringify(docsMap)
		} catch (error) {
			console.error("Vector search failed:", error)
			docContext = ""
		}

		const systemPrompt = {
			role: "system",
			content: `You are an AI assistant who knows everything about Formula One.
Use the below context to augment what you know about Formula One racing. The context will provide you with the most recent page data from Wikipedia, the official F1 website and others.
If the context doesn't include the information you need, answer based on your existing knowledge and don't mention the source of your information or what the context does or doesn't include.
Format responses using markdown where applicable and do not return images.
-------
START CONTEXT
${docContext}
END CONTEXT
-------
QUESTION: ${latestMessage}
-------`
		}

		const result = streamText({
			model: openai('gpt-4'),
			messages: [systemPrompt, ...messages],
		})

		return result.toDataStreamResponse()

	} catch (err) {
		console.error("Request failed:", err)
		return new Response("Internal Server Error", { status: 500 })
	}
}
