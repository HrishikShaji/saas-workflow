import { Environment, ExecutionEnvironment } from "@/types/executor"
import { TextSummarizeTask } from "../../task/text-operations/TextSummarizeTask"
import { TextTranslatorTask } from "../../task/text-operations/TextTranslatorTask"
import { LanguageCode } from "@/types/text";
import { getOpenRouterResponse } from "../../ai/getOpenRouterResponse";
import { models, providersOrder } from "@/lib/constants";



export async function textTranslatorExecutor(environment: ExecutionEnvironment<typeof TextTranslatorTask>) {
	try {
		// Inputs with validation
		const input = environment.getInput("input");
		if (!input || input.trim().length < 3) {
			throw new Error("Input text too short (minimum 3 characters required)");
		}

		const targetLanguage = environment.getInput("target language") as LanguageCode;
		const sourceLanguage = environment.getInput("source language") as LanguageCode | "auto";
		const translationStyle = environment.getInput("style") as "formal" | "informal" | "technical" | "general";
		const culturalAdaptation = environment.getInput("cultural adaptation") as "literal" | "adaptive";
		const glossary = null;

		const model = environment.getSetting("Model");
		const baseTemperature = parseFloat(environment.getSetting("Temperature"));
		const maxTokens = Math.min(
			parseInt(environment.getSetting("Max Tokens")),
			4000
		);
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"));

		const languageNames: Record<LanguageCode, string> = {
			'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
			'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian',
			'zh': 'Chinese', 'ja': 'Japanese', 'ko': 'Korean', 'ml': "Malayalam",
			"hi": "Hindi"
		};

		const effectiveTemperature = Math.min(
			baseTemperature * (culturalAdaptation === "adaptive" ? 1.2 : 0.8),
			0.5
		);

		let glossaryInstructions = "";
		if (glossary && Object.keys(glossary).length > 0) {
			glossaryInstructions = `\n\nGLOSSARY TERMS (use these exact translations):\n${Object.entries(glossary)
				.map(([term, translation]) => `- "${term}" → "${translation}"`)
				.join('\n')
				}`;
		}

		const systemMessage = `
You are a professional translation AI (${model}) with ${culturalAdaptation === "adaptive" ? "cultural adaptation" : "literal precision"
			} capabilities.

TASK:
Translate the following text to ${languageNames[targetLanguage]}${sourceLanguage !== "auto" ? ` from ${languageNames[sourceLanguage]}` : ""
			}.

REQUIREMENTS:
1. Style: ${translationStyle.toUpperCase()}
   ${translationStyle === "formal" ? "- Use honorifics where appropriate" : ""}
   ${translationStyle === "technical" ? "- Preserve technical terms exactly" : ""}

2. Cultural handling:
   ${culturalAdaptation === "adaptive" ?
				"- Adapt idioms/cultural references for target culture" :
				"- Maintain literal meaning of idioms"}

3. Output constraints:
   - Preserve line breaks/formatting
   - Maintain original capitalization style
   - Never add explanatory notes${glossaryInstructions}

4. Special cases:
   - Numbers/measurements: Convert units when culturally appropriate
   - Names/Proper nouns: Keep unchanged unless conventional translation exists
   `;

		let translatedText: string;

		translatedText = await getOpenRouterResponse({
			systemMessage,
			query: input,
			model,
			temperature: effectiveTemperature,
			maxTokens,
			providersOrder
		});

		if (translationStyle === "technical" || culturalAdaptation === "adaptive") {
			const verificationPrompt = `
Verify this ${languageNames[targetLanguage]} translation for:
1. Term consistency ${glossary ? "(especially glossary terms)" : ""}
2. ${culturalAdaptation === "adaptive" ? "Cultural appropriateness" : "Literal accuracy"}
3. Style compliance (${translationStyle})

Original: ${input}
Translation: ${translatedText}

Respond ONLY with the corrected translation or "OK" if perfect.`;

			const verification = await getOpenRouterResponse({
				systemMessage: "You are a translation quality assurance specialist",
				query: verificationPrompt,
				model,
				temperature: 0.1,
				maxTokens,
				providersOrder
			});

			if (verification !== "OK") {
				translatedText = verification;
				environment.log.info("Applied verification corrections");
			}
		}

		environment.setOutput("AI Response", translatedText);
		environment.log.info(`Successfully translated to ${languageNames[targetLanguage]}`);

		return true;
	} catch (error: any) {
		environment.log.error(`Translation failed: ${error.message}`);
		return false;
	}
}

async function detectLanguage(text: string): Promise<LanguageCode> {
	const detectionPrompt = `Detect the language of this text. Respond ONLY with the ISO 639-1 code.\n\n${text}`;
	const detected = await getOpenRouterResponse({
		systemMessage: "You are a language detection expert",
		query: detectionPrompt,
		model: models[0],
		temperature: 0,
		maxTokens: 10,
		providersOrder: providersOrder
	});
	return detected.trim() as LanguageCode;
}
