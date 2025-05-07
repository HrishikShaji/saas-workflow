import { TaskType } from "@/types/task";
import { ExtractTextFromElement } from "./ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./PageToHtml";
import { WorkflowTask } from "@/types/workflow";
import { PromptGeneratorTask } from "./PromptGenerator";
import { DraftGeneratorTask } from "./DraftGenerator";
import { ClarityAgentTask } from "./ClarityAgent";
import { ComplianceAgentTask } from "./ComplianceAgent";
import { ToneAgentTask } from "./ToneAgent";
import { RiskReviewAgentTask } from "./RiskReviewAgent";
import { PolisherAgentTask } from "./PolisherAgent";
import { OptionsAgentTask } from "./OptionsAgent";
import { DatabaseConnectorTask } from "./DatabaseConnector";

type Registry = {
	[K in TaskType]: WorkflowTask & { type: K }
}

export const TaskRegistry: Registry = {
	LAUNCH_BROWSER: LaunchBrowserTask,
	PAGE_TO_HTML: PageToHtmlTask,
	EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement,
	PROMPT_GENERATOR: PromptGeneratorTask,
	DRAFT_GENERATOR: DraftGeneratorTask,
	CLARITY_AGENT: ClarityAgentTask,
	COMPLIANCE_AGENT: ComplianceAgentTask,
	TONE_AGENT: ToneAgentTask,
	RISK_REVIEW_AGENT: RiskReviewAgentTask,
	POLISHER_AGENT: PolisherAgentTask,
	OPTIONS_AGENT: OptionsAgentTask,
	DATABASE_CONNECTOR: DatabaseConnectorTask
}
