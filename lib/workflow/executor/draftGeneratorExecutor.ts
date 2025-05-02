import { Environment, ExecutionEnvironment } from "@/types/executor"
import { DraftGeneratorTask } from "../task/DraftGenerator"
import { getAIResponse } from "../ai/getAIResponse"
import { getOpenRouterResponse } from "../ai/getOpenRouterResponse"

export async function draftGeneratorExecutor(environment: ExecutionEnvironment<typeof DraftGeneratorTask>) {
	try {
		environment.log.info("Starting draft generation process")
		const input = environment.getInput("AI Generated Content")
		const special = environment.getInput("Special")

		const parties = environment.getInput("Parties")
		const parsedParties = JSON.parse(parties)
		const partiesString = parsedParties.join(',')

		const obligations = environment.getInput("Obligations")
		const parsedObligations = JSON.parse(obligations)
		const obligationsString = parsedObligations.join(",")

		const risks = environment.getInput("Risks")
		const parsedRisks = JSON.parse(risks)
		const risksString = parsedRisks.join(",")

		const mustHaves = environment.getInput("Must Haves")
		const parsedMustHaves = JSON.parse(mustHaves)
		const mustHavesString = parsedMustHaves.join(",")


		console.log("these are options", parties, parsedParties, partiesString)
		environment.log.info("Sending request to OpenAI")
		const systemMessage = "You are a legal drafting expert.";
		const query = `Create the first draft of a document titles '${input}'.
		Parties:${partiesString}
		Obligations:${obligationsString}
		Risks to cover:${risksString}
		Must-have clauses:${mustHavesString}
		Special Instructions:${special}

                Structure it with headings and proper legal format
		`;


		const aiResponse = await getOpenRouterResponse({
			systemMessage,
			query
		})
		environment.setOutput("AI Response", aiResponse)
		environment.log.info("Draft generation completed successfully")

		return true
	} catch (error: any) {
		environment.log.error(`Draft generation failed: ${error.message}`)
		return false
	}
}
