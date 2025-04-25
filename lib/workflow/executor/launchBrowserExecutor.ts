import { Environment, ExecutionEnvironment } from "@/types/executor"
import puppeteer from "puppeteer"
import { LaunchBrowserTask } from "../task/LaunchBrowser"

export async function launchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>) {
	try {
		console.log("launch browser executed @@ENV", JSON.stringify(environment, null, 4))
		const websiteUrl = environment.getInput("Website URL")

		console.log("@@WEBSITE URL", websiteUrl)
		const browser = await puppeteer.launch({
			headless: false
		})
		environment.setBrowser(browser)
		const page = await browser.newPage()
		await page.goto(websiteUrl)
		environment.setPage(page)
		return true
	} catch (error) {
		return false
	}
}
