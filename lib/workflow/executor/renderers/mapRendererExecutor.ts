import { Environment, ExecutionEnvironment } from "@/types/executor"
import { MapRendererTask } from "../../task/renderers/MapRendererTask"
import { callStructuredLLMwithJSON } from "../../ai/callStructuredLLMwithJSON";
import { defaultColorStops, GeoMapProps } from "@/app/experimental/components/RenderMap";

const dataSchema = {
	data: "array of {id,state,income} objects"
}
export async function mapRendererExecutor(environment: ExecutionEnvironment<typeof MapRendererTask>) {
	try {
		environment.log.info("Generating map from user prompt...");
		const input = environment.getInput("input")
		const res = await fetch("https://raw.githubusercontent.com/HrishikShaji/maps/refs/heads/main/us-1.json");
		const geoJson = await res.json();
		// Define the schema for structured LLM output
		const schema = {
			mapType: "type of map to generate (choropleth, point, heatmap, or symbol)",
			dataKey: "property key in GeoJSON to use for styling",
			colorStops: "array of [value, color] tuples for choropleth maps",
			longitude: "center longitude of the map view",
			latitude: "center latitude of the map view",
			zoom: "zoom level of the map view",
			height: "height of the map container",
			width: "width of the map container"
		};

		console.log("@@GEOJSON", geoJson)

		// Create the prompt template
		const promptTemplate = `
      Analyze the user's request to create a map and determine the appropriate parameters.
      User request: {prompt}
      
      Available data properties: ${geoJson ? JSON.stringify(Object.keys(geoJson.features[0].properties)) : 'none provided'}
      
      Based on the request, determine:
      1. The most appropriate map type
      2. Which data property to use for styling (if applicable)
      3. Appropriate color stops if it's a choropleth map
      4. A sensible default viewport
      
      Example scenarios:
      - If user asks for "income by state", use choropleth map with income data
      - If user asks for "population density", consider heatmap
      - If user asks to "show points of interest", use point map
      - If user asks to "label cities with names", use symbol map
    `;

		const dataTemplate = `For the input:${input},generate relevant data to map.`
		const dataResponse: any = await callStructuredLLMwithJSON(
			{ prompt: input },
			{
				schema: dataSchema,
				promptTemplate: dataTemplate,
				inputVariables: ["prompt"],
				model: "gpt-4-turbo",
				temperature: 0.2 // Lower temperature for more deterministic output
			}
		);

		// Call the structured LLM
		const response: any = await callStructuredLLMwithJSON(
			{ prompt: input },
			{
				schema,
				promptTemplate,
				inputVariables: ["prompt"],
				model: "gpt-4o-mini",
				temperature: 0.2 // Lower temperature for more deterministic output
			}
		);

		if (!response.success) {
			throw new Error(response.error || "Failed to generate map parameters");
		}

		if (!dataResponse.success) {
			throw new Error(response.error || "Failed to generate data")
		}

		// Prepare the output for the MapRendererTask
		//
		console.log("@@MAPDATA", dataResponse.data)


		console.log("@@OUTPUT", response.data)

		const data = JSON.parse(dataResponse.data)
		const output = JSON.parse(dataResponse.data)

		const finalObject = {
			data: data.data,
			...output
		}

		environment.setOutput("Map Response", JSON.stringify(finalObject));
		return true;
	} catch (error: any) {
		console.log(error)
		environment.log.error(error.message)
		return false
	}
}
