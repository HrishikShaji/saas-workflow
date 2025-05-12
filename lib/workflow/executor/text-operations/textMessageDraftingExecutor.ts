import { ExecutionEnvironment } from "@/types/executor";
import { getOpenRouterResponse } from "../../ai/getOpenRouterResponse";
import { TextMessageDraftingTask } from "../../task/text-operations/TextMessageDraftingTask";

export async function textMessageDraftingExecutor(environment: ExecutionEnvironment<typeof TextMessageDraftingTask>) {
	try {
		const messageType = environment.getInput("messageType");
		const recipient = environment.getInput("recipient");
		const sender = environment.getInput("sender");
		const purpose = environment.getInput("purpose");
		const tone = environment.getInput("tone") || "professional";
		const keyPoints = JSON.parse(environment.getInput("keyPoints"));
		const additionalDetails = environment.getInput("additionalDetails");

		const model = environment.getSetting("Model");
		const temperature = parseFloat(environment.getSetting("Temperature"));
		const maxTokens = parseInt(environment.getSetting("Max Tokens"));
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"));

		let systemMessage: string;
		let query: string;

		if (messageType === "email") {
			const length = environment.getInput("length") || "medium";
			systemMessage = `You are a professional email writer. Compose emails that are:
      1. Appropriate for the context and recipient
      2. Clear and concise
      3. Properly formatted
      4. Tone: ${tone}
      5. Free of errors`;

			query = `Draft a ${length} email:
      - From: ${sender}
      - To: ${recipient}
      - Purpose: ${purpose}
      - Key points to include:
        ${keyPoints.join('\n        ')}
      ${additionalDetails ? `- Additional details: ${additionalDetails}` : ''}`;
		} else { // message
			const platform = environment.getInput("platform") || "general";
			const relationship = environment.getInput("relationship");

			systemMessage = `You are a professional communication specialist. Draft ${platform} messages that are:
      1. Appropriate for the recipient (${relationship})
      2. Clear and concise
      3. Tone: ${tone}
      4. Platform-appropriate formatting`;

			query = `Draft a message:
      - Recipient: ${recipient} (${relationship})
      - Platform: ${platform}
      - Purpose: ${purpose}
      - Key points:
        ${keyPoints.join('\n        ')}
      ${additionalDetails ? `- Additional details: ${additionalDetails}` : ''}`;
		}

		const draft = await getOpenRouterResponse({
			systemMessage,
			query,
			model,
			temperature,
			maxTokens,
			providersOrder
		});

		environment.setOutput("AI Response", draft);
		environment.log.info("Message drafted successfully");
		return true;
	} catch (error: any) {
		environment.log.error(`Message drafting failed: ${error.message}`);
		return false;
	}
}
