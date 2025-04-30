import { TaskType } from "@/types/task";
import { launchBrowserExecutor } from "./launchBrowserExecutor";
import { pageToHtmlExecutor } from "./pageToHtmlExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { extractTextFromElementExecutor } from "./extractTextFromElementExecutor";
import { promptGeneratorExecutor } from "./promptGeneratorExecutor";
import { draftGeneratorExecutor } from "./draftGeneratorExecutor";

type ExecutorFn<T extends WorkflowTask> = (environment: ExecutionEnvironment<T>) => Promise<boolean>

type RegistryType = {
	[K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>
}

export const ExecutorRegistry: RegistryType = {
	LAUNCH_BROWSER: launchBrowserExecutor,
	PAGE_TO_HTML: pageToHtmlExecutor,
	EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementExecutor,
	PROMPT_GENERATOR: promptGeneratorExecutor,
	DRAFT_GENERATOR: draftGeneratorExecutor
}
