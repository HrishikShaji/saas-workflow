
interface Props {
	systemMessage: string;
	query: string;
	model: string;
}

export async function getOpenRouterResponse({ systemMessage, query, model }: Props) {


	const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			'model': model,
			'messages': [
				{
					'role': 'system',
					'content': systemMessage
				},
				{
					'role': 'user',
					'content': query
				}
			],
			'provider': {
				'order': [
					"SambaNova",
					"Groq"
				]
			}
		}),
	});
	//	console.log("this is open router response", response)
	const result = await response.json()

	const aiResponse = result.choices[0]?.message?.content || "No response generated"
	//	console.log("this is open router result", result)
	//	console.log("this is aiRespone", aiResponse)
	return aiResponse
}

