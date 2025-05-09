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
import { databaseAnalyserExecutor } from "./databaseAnalyserExecutor";
import { graphGeneratorExecutor } from "./graphGeneratorExecutor";
import { textSummarizeExecutor } from "./text-operations/textSummarizeExecutor";
import { textParaphrasingExecutor } from "./text-operations/textParaphrasingExecutor";
import { textTranslatorExecutor } from "./text-operations/textTranslatorExecutor";
import { textSimplifyExecutor } from "./text-operations/textSimplifyExecutor";
import { textElaboratorExecutor } from "./text-operations/textElaboratorExecutor";
import { textFormatConverterExecutor } from "./text-operations/textFormatConverterExecutor";
import { textEntityExtractorExecutor } from "./text-operations/textEntityExtractorExecutor";

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
	DATABASE_OPERATOR: databaseOperatorExecutor,
	DATABASE_ANALYSER: databaseAnalyserExecutor,
	GRAPH_GENERATOR: graphGeneratorExecutor,
	TEXT_ENTITY_EXTRACTOR: textEntityExtractorExecutor,
	TEXT_SUMMARIZE: textSummarizeExecutor,
	TEXT_PARAPHRASING: textParaphrasingExecutor,
	TEXT_TRANSLATOR: textTranslatorExecutor,
	TEXT_SIMPLIFY: textSimplifyExecutor,
	TEXT_ELABORATOR: textElaboratorExecutor,
	TEXT_FORMAT_CONVERTER: textFormatConverterExecutor
}
