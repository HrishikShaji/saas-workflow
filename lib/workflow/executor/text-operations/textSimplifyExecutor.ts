
import { Environment, ExecutionEnvironment } from "@/types/executor"
import { TextSummarizeTask } from "../../task/text-operations/TextSummarizeTask"
import { TextSimplifyTask } from "../../task/text-operations/TextSimplifyTask"
import { getOpenRouterResponse } from "../../ai/getOpenRouterResponse";



export async function textSimplifyExecutor(environment: ExecutionEnvironment<typeof TextSimplifyTask>) {
	try {
		// Input validation
		const input = environment.getInput("input");
		if (!input || input.trim().length < 10) {
			throw new Error("Input text too short (minimum 10 characters required)");
		}

		const level = parseInt(environment.getInput("level")); // Expecting 1-5 scale
		const targetAudience = environment.getInput("audience") || "general"; // e.g., "children", "non-native", "dyslexic"

		// Settings with validation
		const model = environment.getSetting("Model");
		const baseTemperature = parseFloat(environment.getSetting("Temperature"));
		const maxTokens = parseInt(environment.getSetting("Max Tokens"));
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"));

		// Clamp level between 1-5
		const clampedLevel = Math.min(Math.max(level, 1), 5);

		// Dynamic configuration based on level
		const simplificationParams = {
			sentenceLength: Math.max(15 - (clampedLevel * 2), 5), // Target words per sentence
			lexicalComplexity: 1 - (clampedLevel * 0.15), // 0-1 scale
			paragraphLength: Math.max(5 - clampedLevel, 1) // Sentences per paragraph
		};

		// Adjust temperature based on level (higher for more creative simplifications)
		const effectiveTemperature = Math.min(baseTemperature * (1 + (clampedLevel * 0.1)), 0.7);

		// Audience-specific instructions
		let audienceInstructions = "";
		switch (targetAudience) {
			case "children":
				audienceInstructions = "Use simple words suitable for a 8-12 year old. Include concrete examples where helpful.";
				break;
			case "non-native":
				audienceInstructions = "Use common words from the 2000 most frequent English words list. Avoid idioms.";
				break;
			case "dyslexic":
				audienceInstructions = "Prefer short words with clear phonetic spelling. Use dyslexia-friendly formatting suggestions.";
				break;
			default:
				audienceInstructions = "Make the text accessible to average adult readers.";
		}

		const systemMessage = `You are a text simplification expert. Rewrite the following text to:
- Reading level: Grade ${clampedLevel + 5} (1=easiest, 5=moderate)
- Target audience: ${targetAudience}
- Key requirements:
  1. Sentence length: ≤${simplificationParams.sentenceLength} words
  2. Paragraph length: ≤${simplificationParams.paragraphLength} sentences
  3. Lexical complexity: ≤${simplificationParams.lexicalComplexity.toFixed(1)}/1.0
  4. ${audienceInstructions}

PRESERVE:
- Core meaning and facts
- Proper nouns and numbers
- Intent and tone

TRANSFORM:
- Complex sentences → simple structures
- Advanced vocabulary → common equivalents
- Passive voice → active voice (where possible)

OUTPUT REQUIREMENTS:
- Return only the simplified text
- Maintain original line breaks for paragraphs
- Never add comments or explanations`;

		const simplifiedText = await getOpenRouterResponse({
			systemMessage,
			query: input,
			model,
			temperature: effectiveTemperature,
			maxTokens,
			providersOrder
		});

		// Quality verification for high-stakes simplification
		if (clampedLevel >= 4 || targetAudience === "dyslexic") {
			const verificationPrompt = `Verify this simplified text meets requirements:
1. Grade level ${clampedLevel + 5}
2. ${audienceInstructions}
3. No meaning loss

Original: ${input}
Simplified: ${simplifiedText}

Respond with "APPROVED" or suggest improvements:`;

			const verification = await getOpenRouterResponse({
				systemMessage: "You are a text accessibility validator",
				query: verificationPrompt,
				model, // Use more capable model for verification
				temperature: 0.1,
				maxTokens,
				providersOrder
			});

			if (verification !== "APPROVED") {
				environment.setOutput("AI Response", verification);
			} else {
				environment.setOutput("AI Response", simplifiedText);
			}
		} else {
			environment.setOutput("AI Response", simplifiedText);
		}

		environment.log.info(`Text simplified to level ${clampedLevel} for ${targetAudience} audience`);
		return true;
	} catch (error: any) {
		environment.log.error(`Simplification failed: ${error.message}`);
		return false;
	}
}
