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
import { DatabaseOperatorTask } from "./DatabaseOperator";
import { DatabaseAnalyserTask } from "./DatabaseAnalyser";
import { GraphGeneratorTask } from "./GraphGenerator";
import { TextSummarizeTask } from "./text-operations/TextSummarizeTask";
import { TextParaphrasingTask } from "./text-operations/TextParaphrasingTask";
import { TextTranslatorTask } from "./text-operations/TextTranslatorTask";
import { TextSimplifyTask } from "./text-operations/TextSimplifyTask";
import { TextElaboratorTask } from "./text-operations/TextElaboratorTask";
import { TextFormatConverterTask } from "./text-operations/TextFormatConverter";
import { TextEntityExtractorTask } from "./text-operations/TextEntityExtractor";
import { TextContentCreationTask } from "./text-operations/TextContentCreationTask";
import { TextTemplateFillingTask } from "./text-operations/TextTemplateFillingTask";
import { TextMessageDraftingTask } from "./text-operations/TextMessageDraftingTask";
import { TextCodeGenerationTask } from "./text-operations/TextCodeGenerationTask";
import { TextStoryWritingTask } from "./text-operations/TextStoryWritingTask";
import { SimplePromptTask } from "./llm-operations/SimplePromptTask";
import { MapRendererTask } from "./renderers/MapRendererTask";
import { VariableTask } from "./math/VariableTask";
import { OperationTask } from "./math/OperationTask";

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
	DATABASE_CONNECTOR: DatabaseConnectorTask,
	DATABASE_OPERATOR: DatabaseOperatorTask,
	DATABASE_ANALYSER: DatabaseAnalyserTask,
	GRAPH_GENERATOR: GraphGeneratorTask,
	TEXT_ENTITY_EXTRACTOR: TextEntityExtractorTask,
	TEXT_SUMMARIZE: TextSummarizeTask,
	TEXT_PARAPHRASING: TextParaphrasingTask,
	TEXT_TRANSLATOR: TextTranslatorTask,
	TEXT_SIMPLIFY: TextSimplifyTask,
	TEXT_ELABORATOR: TextElaboratorTask,
	TEXT_FORMAT_CONVERTER: TextFormatConverterTask,
	TEXT_CONTENT_CREATION: TextContentCreationTask,
	TEXT_TEMPLATE_FILLING: TextTemplateFillingTask,
	TEXT_MESSAGE_DRAFTING: TextMessageDraftingTask,
	TEXT_CODE_GENERATION: TextCodeGenerationTask,
	TEXT_STORY_WRITING: TextStoryWritingTask,
	SIMPLE_PROMPT: SimplePromptTask,
	MAP_RENDERER: MapRendererTask,
	VARIABLE: VariableTask,
	OPERATION: OperationTask
}
