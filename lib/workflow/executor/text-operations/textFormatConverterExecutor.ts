import { Environment, ExecutionEnvironment } from "@/types/executor"
import { TextFormatConverterTask } from "../../task/text-operations/TextFormatConverter"
import { getOpenRouterResponse } from "../../ai/getOpenRouterResponse";
import { models, providersOrder } from "@/lib/constants";



export async function textFormatConverterExecutor(environment: ExecutionEnvironment<typeof TextFormatConverterTask>) {
	try {
		// --- Input Validation ---
		const input = environment.getInput("input");
		const format = environment.getInput("format") as "json" | "csv" | "xml" | "txt";
		const sourceFormat = environment.getInput("sourceFormat") as "auto" | "json" | "csv" | "xml" | "txt";
		const prettyPrint = environment.getInput("prettyPrint") === "true";
		const textDelimiter = "|";
		const strictMode = environment.getInput("strictMode") !== "false"; // Default true

		if (!input || input.trim().length === 0) {
			throw new Error("Input text cannot be empty");
		}

		// --- Settings Configuration ---
		const model = environment.getSetting("Model");
		const temperature = Math.min(parseFloat(environment.getSetting("Temperature")), 0.3);
		const maxTokens = parseInt(environment.getSetting("Max Tokens"));
		const providersOrder = JSON.parse(environment.getSetting("Providers Order"));

		// --- Format Detection ---
		const detectedFormat = sourceFormat === "auto" ? detectFormat(input) : sourceFormat;
		if (detectedFormat === format) {
			environment.setOutput("AI Response", input);
			return true;
		}

		// --- Conversion System Messages ---
		const conversionTemplates = {
			// JSON Conversions
			"json-to-csv": `Convert JSON to CSV with:
- First row as header
- Proper escaping per RFC 4180
- Empty values as ""
- No trailing commas`,
			"json-to-xml": `Convert JSON to XML with:
- Root element <data>
- Arrays as <item> elements
- ${prettyPrint ? "Pretty-printed with indentation" : "Compact format"}
- XML entity escaping`,
			"json-to-txt": `Convert JSON to human-readable text with:
- Key${textDelimiter}Value pairs
- One pair per line
- Nested objects indented with 2 spaces
- Arrays as bullet points`,

			// CSV Conversions
			"csv-to-json": `Convert CSV to JSON with:
- Array of objects format
- Automatic type inference
- Empty cells as null
- First row as property names`,
			"csv-to-xml": `Convert CSV to XML with:
- Root element <records>
- Each row as <record>
- Columns as child elements
- ${prettyPrint ? "Pretty-printed" : "Compact"}`,
			"csv-to-txt": `Convert CSV to aligned text table with:
- Columns separated by "${textDelimiter}"
- Header underlined with "="
- Values trimmed and padded
- Empty cells as "(blank)"`,

			// XML Conversions
			"xml-to-json": `Convert XML to JSON with:
- Attributes as _attribute fields
- Text content in _text field
- Arrays for repeated elements
- Automatic type conversion`,
			"xml-to-csv": `Convert XML to CSV with:
- First row from element/attribute names
- One row per repeating element
- Text content for values
- Attributes as columns prefixed with @`,
			"xml-to-txt": `Convert XML to readable text with:
- Hierarchical indentation
- Attributes in [brackets]
- Only text content shown
- Empty elements as "(empty)"`,

			// Text Conversions
			"txt-to-json": `Convert text to JSON with:
- Lines containing "${textDelimiter}" become key-value pairs
- Other lines become array elements
- Automatic number/boolean detection
- Trim whitespace from values`,
			"txt-to-csv": `Convert text to CSV with:
- "${textDelimiter}" as column separator
- First line as headers if uniform
- RFC 4180 escaping
- Empty lines skipped`,
			"txt-to-xml": `Convert text to XML with:
- Root element <text>
- Each non-empty line as <line>
- CDATA wrapping for special chars
- ${prettyPrint ? "Indented" : "Compact"}`
		};

		// --- Core Conversion Logic ---
		const conversionKey = `${detectedFormat}-to-${format}` as keyof typeof conversionTemplates;
		const systemMessage = `You are a data format conversion expert. Strictly follow these requirements:

${conversionTemplates[conversionKey]}

STRICT RULES:
1. Preserve ALL original data
2. Maintain field order
3. No additional commentary
4. Output ONLY the converted data
${strictMode ? "5. Reject if conversion would lose data" : ""}`;

		const convertedText = await getOpenRouterResponse({
			systemMessage,
			query: input,
			model,
			temperature,
			maxTokens,
			providersOrder
		});

		// --- Validation ---
		const validationResult = await validateConversion({
			original: input,
			converted: convertedText,
			sourceFormat: detectedFormat,
			targetFormat: format,
			strictMode
		});

		if (!validationResult.isValid) {
			throw new Error(validationResult.error || "Conversion validation failed");
		}

		// --- Output Handling ---
		environment.setOutput("AI Response", convertedText);

		if (validationResult.warnings) {
			//	environment.setOutput("warnings", validationResult.warnings);
		}

		environment.log.info(`Successfully converted ${detectedFormat} → ${format}`);
		return true;

	} catch (error: any) {
		environment.log.error(`Conversion failed: ${error.message}`);
		return false;
	}
}

// --- Helper Functions ---

function detectFormat(input: string): "json" | "csv" | "xml" | "txt" {
	const trimmed = input.trim();

	// JSON Detection
	if ((trimmed.startsWith("{") || trimmed.startsWith("[")) && trimmed.endsWith("}") || trimmed.endsWith("]")) {
		try {
			JSON.parse(trimmed);
			return "json";
		} catch { }
	}

	// XML Detection
	if (trimmed.startsWith("<") && trimmed.endsWith(">") && trimmed.includes("</")) {
		return "xml";
	}

	// CSV Detection
	const firstNewLine = trimmed.indexOf("\n");
	if (firstNewLine > 0) {
		const firstLine = trimmed.substring(0, firstNewLine);
		const secondLine = trimmed.substring(firstNewLine + 1).split("\n")[0];
		if (firstLine.includes(",") && secondLine.includes(",")) {
			return "csv";
		}
	}

	// Fallback to text
	return "txt";
}

async function validateConversion(params: {
	original: string;
	converted: string;
	sourceFormat: string;
	targetFormat: string;
	strictMode: boolean;
}): Promise<{ isValid: boolean; error?: string; warnings?: string[] }> {

	const { original, converted, sourceFormat, targetFormat, strictMode } = params;
	const warnings: string[] = [];

	// Basic empty check
	if (!converted.trim()) {
		return { isValid: false, error: "Converted output is empty" };
	}

	// Structure validation
	try {
		if (targetFormat === "json") {
			JSON.parse(converted);
		} else if (targetFormat === "xml") {
			if (!converted.includes("<") || !converted.includes(">")) {
				return { isValid: false, error: "Invalid XML structure" };
			}
		} else if (targetFormat === "csv") {
			if (!converted.includes("\n") && sourceFormat !== "txt") {
				warnings.push("CSV output contains only one line");
			}
		}
	} catch (e) {
		return { isValid: false, error: `Invalid ${targetFormat} structure` };
	}

	// Strict mode validation
	if (strictMode) {
		const validationPrompt = `Verify this ${targetFormat} conversion from ${sourceFormat}:
1. ALL original data preserved exactly
2. No data corruption
3. Valid ${targetFormat} syntax

Original (first 200 chars):
${original.slice(0, 200)}

Converted (first 200 chars):
${converted.slice(0, 200)}

Respond ONLY with "VALID" or list missing/invalid data points:`;

		const validation = await getOpenRouterResponse({
			systemMessage: "You are a strict data validation expert",
			query: validationPrompt,
			model: models[0],
			temperature: 0,
			maxTokens: 200,
			providersOrder: providersOrder
		});

		if (validation.trim() !== "VALID") {
			return { isValid: false, error: `Data validation failed: ${validation}` };
		}
	}

	return { isValid: true, warnings };
}
