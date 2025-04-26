

import { Environment, ExecutionEnvironment } from "@/types/executor"
import { ExtractTextFromElement } from "../task/ExtractTextFromElement"
import * as cheerio from "cheerio"


export async function extractTextFromElementExecutor(environment: ExecutionEnvironment<typeof ExtractTextFromElement>) {
	try {
		console.log("launch browser executed @@ENV", JSON.stringify(environment, null, 4))
		const selector = environment.getInput("Selector")
		if (!selector) {
			console.error("no selector", selector)
			environment.log.error("selector not defined")
			return false;
		}

		const html = environment.getInput("Html")
		if (!html) {
			console.error("no html", html)
			environment.log.error("html not defined")
			return false;
		}

		const $ = cheerio.load(html)
		const element = $(selector)

		if (!element) {
			environment.log.error("Element not found")
			console.error("Element not found")
		}

		const extractedText = $.text(element)
		if (!extractedText) {
			environment.log.error("Element has no text")
			console.error("Element has no text")
			return false
		}

		environment.setOutput("Extracted text", extractedText)

		return true
	} catch (error: any) {
		environment.log.error(error.message)
		return false
	}
}
