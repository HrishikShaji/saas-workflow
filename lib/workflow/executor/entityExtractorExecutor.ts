import { Environment, ExecutionEnvironment } from "@/types/executor"
import { EntityExtractorTask } from "../task/EntityExtractor"
import nlp from "compromise"
import datePlugin from "compromise-dates"
import { extractCreditCards, extractEmails, extractHashtags, extractIPs, extractMentions, extractPhoneNumbers, extractTimes, extractUrls } from "@/lib/textExtraction"

nlp.plugin(datePlugin)

type EntityExtractor = (input: string | any) => any;

export async function entityExtractorExecutor(environment: ExecutionEnvironment<typeof EntityExtractorTask>) {
	try {
		const input = environment.getInput("input")
		const entitiesToExtract = environment.getInput("entities")
		const parsedEntities = JSON.parse(entitiesToExtract) as string[]
		environment.log.info("Input received")

		const model = environment.getSetting("Model")
		const temperature = parseInt(environment.getSetting("Temperature"))
		const maxTokens = parseInt(environment.getSetting("Max Tokens"))
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"))

		const doc: any = nlp(input)

		const entityExtractors: Record<string, EntityExtractor> = {
			people: (d) => d.people().out('array'),
			organizations: (d) => d.organizations().out('array'),
			places: (d) => d.places().out('array'),
			dates: (d) => d.dates().get(),
			values: (d) => d.values().out('array'),
			money: (d) => d.money().out('array'),
			percentages: (d) => d.percentages().out('array'),
			possessives: (d) => d.possessives().out('array'),
			acronyms: (d) => d.acronyms().out('array'),
			quotes: (d) => d.quotations().out('array'),
			emailAddresses: extractEmails,
			phoneNumbers: extractPhoneNumbers,
			urls: extractUrls,
			hashtags: extractHashtags,
			mentions: extractMentions,
			ipAddresses: extractIPs,
			creditCards: extractCreditCards,
			times: extractTimes,
			nouns: (d) => d.nouns().out('array'),
			verbs: (d) => d.verbs().out('array'),
			adjectives: (d) => d.adjectives().out('array')
		}

		const requiredEntities: Record<string, any> = {}

		for (const entity of parsedEntities) {
			if (entityExtractors[entity]) {
				try {
					requiredEntities[entity] = entityExtractors[entity](entityExtractors[entity].length === 1 ? doc : input)
				} catch (error) {
					environment.log.error(`Failed to extract entity ${entity}: ${error}`)
					requiredEntities[entity] = []
				}
			} else {
				environment.log.error(`Unknown entity type requested: ${entity}`)
			}
		}

		environment.log.info(`Extracted entities: ${JSON.stringify(Object.keys(requiredEntities))}`)
		environment.setOutput("AI Response", JSON.stringify(requiredEntities))
		environment.log.info("Response is outputted")

		return true
	} catch (error: any) {
		console.log(error)
		environment.log.error(error.message)
		return false
	}
}
