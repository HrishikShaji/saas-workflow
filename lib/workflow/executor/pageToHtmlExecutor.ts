
import { Environment, ExecutionEnvironment } from "@/types/executor"
import { LaunchBrowserTask } from "../task/LaunchBrowser"
import { PageToHtmlTask } from "../task/PageToHtml"

export async function pageToHtmlExecutor(environment: ExecutionEnvironment<typeof PageToHtmlTask>) {
	try {
		console.log("launch browser executed @@ENV", JSON.stringify(environment, null, 4))
		const html = await environment.getPage()!.content()
		console.log("@@PAGE", html)
		environment.setOutput("Website URL", html)
		return true
	} catch (error) {
		return false
	}
}
