import { launchBrowserExecutor } from "./launchBrowserExecutor";

export const ExecutorRegistry = {
	LAUNCH_BROWSER: launchBrowserExecutor,
	PAGE_TO_HTML: () => { return true },
	EXTRACT_TEXT_FROM_ELEMENT: () => { return true }
}
