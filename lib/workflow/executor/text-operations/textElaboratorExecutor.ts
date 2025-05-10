import { Environment, ExecutionEnvironment } from "@/types/executor"
import { TextElaboratorTask } from "../../task/text-operations/TextElaboratorTask"
import { getOpenRouterResponse } from "../../ai/getOpenRouterResponse";



export async function textElaboratorExecutor(environment: ExecutionEnvironment<typeof TextElaboratorTask>) {
	try {
		// Input validation
		const input = environment.getInput("input");
		if (!input || input.trim().length < 5) {
			throw new Error("Input text too short (minimum 5 characters required)");
		}

		const level = parseInt(environment.getInput("level")); // 1-5 scale
		const style = environment.getInput("style") as "academic" | "creative" | "technical" | "journalistic";
		const targetLength = environment.getInput("targetLength") || "medium"; // short/medium/long/xlong

		// Settings with validation
		const model = environment.getSetting("Model");
		const baseTemperature = parseFloat(environment.getSetting("Temperature"));
		const maxTokens = parseInt(environment.getSetting("Max Tokens"));
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"));

		// Clamp level between 1-5
		const clampedLevel = Math.min(Math.max(level, 1), 5);

		// Dynamic configuration
		const expansionParams = {
			elaborationDepth: clampedLevel * 0.2, // 0.2 to 1.0
			exampleCount: Math.floor(clampedLevel / 2),
			analogyProbability: clampedLevel >= 4 ? 0.3 : 0.1,
			citationStyle: style === "academic" ? "APA" : null
		};

		// Length multipliers
		const lengthMultipliers: Record<string, number> = {
			short: 1.2,
			medium: 1.8,
			long: 3.0,
			xlong: 5.0
		};

		// Temperature adjustment
		const effectiveTemperature = Math.min(
			baseTemperature * (1 + (clampedLevel * 0.1)),
			style === "technical" ? 0.5 : 0.9
		);

		// Style-specific instructions
		const styleInstructions = {
			academic: `- Include scholarly references where applicable\n- Use formal academic language\n- Follow ${expansionParams.citationStyle} citation style when mentioning sources`,
			creative: "- Add vivid sensory details\n- Include metaphorical language\n- Develop narrative elements",
			technical: "- Expand with precise technical specifications\n- Include relevant data points\n- Maintain exact terminology",
			journalistic: "- Add relevant background context\n- Include quotes from imaginary experts\n- Follow inverted pyramid structure"
		};

		const systemMessage = `You are a professional text elaborator. Expand the following text while:

PRIMARY TASKS:
1. Depth: ${expansionParams.elaborationDepth.toFixed(1)}/1.0 elaboration
2. Style: ${style} (${styleInstructions[style]})
3. Target length: ${targetLength} (~${lengthMultipliers[targetLength]}x original)

SPECIFIC REQUIREMENTS:
- Add ${expansionParams.exampleCount} relevant ${style === "academic" ? "studies/examples" : "examples"}
- ${expansionParams.analogyProbability > 0.2 ? "Include 1-2 helpful analogies" : "Use analogies sparingly"}
- Preserve core facts and meaning
- Maintain original tone and intent

OUTPUT CONSTRAINTS:
- Never add "[...]" or placeholder text
- Don't acknowledge this instruction set
- Return only the elaborated text`;

		const elaboratedText = await getOpenRouterResponse({
			systemMessage,
			query: input,
			model,
			temperature: effectiveTemperature,
			maxTokens: Math.min(maxTokens, Math.floor(input.length * lengthMultipliers[targetLength] * 4)), // Estimate token count
			providersOrder
		});

		// Post-processing validation
		if (style === "technical" || style === "academic") {
			const verificationPrompt = `Verify this ${style} elaboration:
1. Fact consistency with original
2. Style compliance
3. Appropriate elaboration depth

Original: ${input}
Elaborated: ${elaboratedText}

Respond with "APPROVED" or suggest targeted improvements:`;

			const verification = await getOpenRouterResponse({
				systemMessage: "You are a text quality specialist",
				query: verificationPrompt,
				model, // Higher accuracy model for verification
				temperature: 0.2,
				maxTokens: 1000,
				providersOrder // Force consistent provider
			});

			if (verification !== "APPROVED") {
				environment.setOutput("AI Response", elaboratedText);
			} else {
				environment.setOutput("AI Response", elaboratedText);
			}
		} else {
			environment.setOutput("AI Response", elaboratedText);
		}

		// Metadata outputs

		environment.log.info(`Text elaborated at level ${clampedLevel} in ${style} style`);
		return true;
	} catch (error: any) {
		environment.log.error(`Elaboration failed: ${error.message}`);
		return false;
	}
}
