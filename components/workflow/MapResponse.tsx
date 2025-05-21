import { useEffect, useState } from "react";
import { GenericMap } from "../maps/GenericMap";
import { worldJson } from "../../lib/maps/world-json"

interface Props {
	data: string;
}

const incomeColorScale = (income: number) => {
	if (income >= 80000) return "#000000"
	if (income >= 70000) return "#000000"
	if (income >= 60000) return "#000000"
	if (income >= 50000) return "#000000"
	return "#ccfbf1"
}

const sampleUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

const worldUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
const geoUrl =
	"https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"
export default function MapResponse({ data }: Props) {
	const [mapData, setMapData] = useState(null)
	const [finalData, setFinalData] = useState([])
	const [geo, setGeo] = useState({})

	useEffect(() => {

		try {
			const parsed = JSON.parse(data)
			console.log("@@PARSED", parsed)
			setMapData(parsed)

			const fullData = JSON.parse(parsed.data)
			const geoJson = JSON.parse(parsed.geoJson)
			console.log("@@DATA", fullData)
			console.log("@@GEO", geoJson)
			setFinalData(fullData)
			setGeo(geoJson)
		} catch (err) {
			setMapData(null)
		}
	}, [])
	if (!mapData) {
		return null
	}

	//console.log("@@MapDATa", mapData)

	return <GenericMap
		geoUrl={sampleUrl}
		geoJSON={worldJson}
		data={finalData.map(item => ({
			id: item.id,
			name: item.state,
			value: item.income
		}))}
		colorScale={incomeColorScale}
	/>

}
