import { Environment, ExecutionEnvironment } from "@/types/executor"
import puppeteer from "puppeteer"

export async function launchBrowserExecutor(environment: ExecutionEnvironment) {
	try {
		console.log("launch browser executed @@ENV", JSON.stringify(environment, null, 4))
		const websiteUrl = environment.getInput("Website URL")

		console.log("@@WEBSITE URL", websiteUrl)
		const browser = await puppeteer.launch({
			headless: false
		})
		await browser.close()
		return true
	} catch (error) {
		return false
	}
}
