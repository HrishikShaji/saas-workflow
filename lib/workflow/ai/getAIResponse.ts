import OpenAI from "openai"

const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: process.env.OPEN_ROUTER_API_KEY,
})


export async function getAIResponse({ systemMessage, query }: { systemMessage: string; query: string }) {

	const completion = await openai.chat.completions.create({
		model: "meta-llama/llama-4-maverick",
		messages: [
			{
				role: "system",
				content: systemMessage
			},
			{
				role: "user",
				content: query
			}
		],
		temperature: 0.7,
		max_tokens: 2000
	})

	const aiResponse = completion.choices[0]?.message?.content || "No response generated"

	return aiResponse
}

