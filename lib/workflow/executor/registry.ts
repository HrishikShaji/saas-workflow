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
import { textContentCreationExecutor } from "./text-operations/textContentCreationExecutor";
import { textTemplateFillingExecutor } from "./text-operations/textTemplateFillingExecutor";
import { textMessageDraftingExecutor } from "./text-operations/textMessageDraftingExecutor";
import { textCodeGenerationExecutor } from "./text-operations/textCodeGenerationExecutor";
import { textStoryWritingExecutor } from "./text-operations/textStoryWritingExecutor";
import { simplePromptExecutor } from "./llm-operations/simplePromptExecutor";
import { mapRendererExecutor } from "./renderers/mapRendererExecutor";

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
	TEXT_FORMAT_CONVERTER: textFormatConverterExecutor,
	TEXT_CONTENT_CREATION: textContentCreationExecutor,
	TEXT_TEMPLATE_FILLING: textTemplateFillingExecutor,
	TEXT_MESSAGE_DRAFTING: textMessageDraftingExecutor,
	TEXT_CODE_GENERATION: textCodeGenerationExecutor,
	TEXT_STORY_WRITING: textStoryWritingExecutor,
	SIMPLE_PROMPT: simplePromptExecutor,
	MAP_RENDERER: mapRendererExecutor
}
