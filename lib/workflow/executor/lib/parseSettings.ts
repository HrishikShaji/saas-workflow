import { ExecutionEnvironment } from "@/types/executor"
import { PolisherAgentTask } from "../../task/PolisherAgent"

export default function parseSettings(environment: ExecutionEnvironment<typeof PolisherAgentTask>) {
	const settings: any = {
		model: environment.getSetting("Model"),
		userSchemaString: environment.getSetting("Schema"),
		temperature: parseInt(environment.getSetting("Temperature")),
		maxTokens: parseInt(environment.getSetting("Max Tokens")),
		providersOrder: JSON.parse(environment.getSetting("Providers Order"))
	}

	try {
		settings.userSchema = JSON.parse(settings.userSchemaString)
	} catch (error: any) {
		throw new Error(`Invalid schema JSON: ${error.message}`)
	}

	if (isNaN(settings.temperature)) {
		throw new Error('Temperature must be a number')
	}

	if (isNaN(settings.maxTokens)) {
		throw new Error('Max Tokens must be a number')
	}

	if (!Array.isArray(settings.providersOrder)) {
		throw new Error('Providers Order must be an array')
	}

	return {
		model: settings.model,
		userSchema: settings.userSchema,
		temperature: settings.temperature,
		maxTokens: settings.maxTokens,
		providersOrder: settings.providersOrder
	}
}
