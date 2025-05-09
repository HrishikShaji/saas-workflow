import { Environment, ExecutionEnvironment } from "@/types/executor"
import { EntityExtractorTask } from "../task/EntityExtractor"
import nlp from "compromise"
import datePlugin from "compromise-dates"
import { extractCreditCards, extractEmails, extractHashtags, extractIPs, extractMentions, extractPhoneNumbers, extractTimes, extractUrls } from "@/lib/textExtraction"

nlp.plugin(datePlugin)


export async function entityExtractorExecutor(environment: ExecutionEnvironment<typeof EntityExtractorTask>) {
	try {
		const input = environment.getInput("input")
		environment.log.info("Input received")
		const model = environment.getSetting("Model")
		const temperature = parseInt(environment.getSetting("Temperature"))
		const maxTokens = parseInt(environment.getSetting("Max Tokens"))
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"))

		console.log("this is input", input)
		const doc: any = nlp(input);

		const entities = {
			people: doc.people().out('array'),
			organizations: doc.organizations().out('array'),
			places: doc.places().out('array'),
			dates: doc.dates().get(),
			values: doc.values().out('array'),
			money: doc.money().out('array'),
			percentages: doc.percentages().out('array'),
			possessives: doc.possessives().out('array'),
			acronyms: doc.acronyms().out('array'),
			quotes: doc.quotations().out('array'),

			emailAddresses: extractEmails(input),
			phoneNumbers: extractPhoneNumbers(input),
			urls: extractUrls(input),
			hashtags: extractHashtags(input),
			mentions: extractMentions(input),
			ipAddresses: extractIPs(input),
			creditCards: extractCreditCards(input),
			times: extractTimes(input),

			nouns: doc.nouns().out('array'),
			verbs: doc.verbs().out('array'),
			adjectives: doc.adjectives().out('array')
		};

		console.log("these are entities", entities)
		environment.log.info(`Sending request to ${model},temperature:${temperature},max tokens:${maxTokens},providers order:${JSON.stringify(providersOrder)}`)

		environment.setOutput("AI Response", JSON.stringify(entities))
		environment.log.info(`Response is outputted`)

		return true
	} catch (error: any) {
		console.log(error)
		environment.log.error(error.message)
		return false
	}
}
