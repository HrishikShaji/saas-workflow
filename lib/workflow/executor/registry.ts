import { TaskType } from "@/types/task";
import { launchBrowserExecutor } from "./launchBrowserExecutor";
import { pageToHtmlExecutor } from "./pageToHtmlExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { extractTextFromElementExecutor } from "./extractTextFromElementExecutor";
import { promptGeneratorExecutor } from "./promptGeneratorExecutor";
import { draftGeneratorExecutor } from "./draftGeneratorExecutor";
import { clarityGeneratorExecutor } from "./clarityAgentExecutor";
import { complianceAgentExecutor } from "./complianceAgentExecutor";
import { toneAgentExecutor } from "./toneAgentExecutor";
import { riskReviewAgentExecutor } from "./riskReviewAgentExecutor";
import { polisherAgentExecutor } from "./polisherAgentExecutor";
import { optionsAgentExecutor } from "./optionsAgentExecutor";
import { databaseConnectorExecutor } from "./databaseConnectorExecutor";
import { databaseOperatorExecutor } from "./databaseOperatorExecutor";

type ExecutorFn<T extends WorkflowTask> = (environment: ExecutionEnvironment<T>) => Promise<boolean>

type RegistryType = {
	[K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>
}

export const ExecutorRegistry: RegistryType = {
	LAUNCH_BROWSER: launchBrowserExecutor,
	PAGE_TO_HTML: pageToHtmlExecutor,
	EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementExecutor,
	PROMPT_GENERATOR: promptGeneratorExecutor,
	DRAFT_GENERATOR: draftGeneratorExecutor,
	CLARITY_AGENT: clarityGeneratorExecutor,
	COMPLIANCE_AGENT: complianceAgentExecutor,
	TONE_AGENT: toneAgentExecutor,
	RISK_REVIEW_AGENT: riskReviewAgentExecutor,
	POLISHER_AGENT: polisherAgentExecutor,
	OPTIONS_AGENT: optionsAgentExecutor,
	DATABASE_CONNECTOR: databaseConnectorExecutor,
	DATABASE_OPERATOR: databaseOperatorExecutor
}
