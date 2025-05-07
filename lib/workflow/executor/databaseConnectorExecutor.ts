import { Environment, ExecutionEnvironment } from "@/types/executor"
import { DatabaseConnectorTask } from "../task/DatabaseConnector"

export async function databaseConnectorExecutor(environment: ExecutionEnvironment<typeof DatabaseConnectorTask>) {
	try {
		const databaseUrl = environment.getInput("Database URL")
		const databaseProvider = environment.getInput("Database Provider")

		const databaseInstance = ""

		environment.setDatabase(databaseInstance)

		return true
	} catch (error: any) {
		environment.log.error(error.message)
		return false
	}
}
