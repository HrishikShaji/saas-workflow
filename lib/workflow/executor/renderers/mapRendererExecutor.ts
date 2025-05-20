import { Environment, ExecutionEnvironment } from "@/types/executor"
import { MapRendererTask } from "../../task/renderers/MapRendererTask"

export async function mapRendererExecutor(environment: ExecutionEnvironment<typeof MapRendererTask>) {
	try {
		console.log("launch browser executed @@ENV", JSON.stringify(environment, null, 4))
		environment.log.info(`Response is outputted`)
		const mapData = environment.getInput("mapData")

		environment.setOutput("Map Response", mapData)
		return true
	} catch (error: any) {
		console.log(error)
		environment.log.error(error.message)
		return false
	}
}
