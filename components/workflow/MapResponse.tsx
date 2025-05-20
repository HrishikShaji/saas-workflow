import { useEffect, useState } from "react";
import { GenericMap } from "../maps/GenericMap";

interface Props {
	data: string;
}

const incomeColorScale = (income: number) => {
	if (income >= 80000) return "#0f766e"
	if (income >= 70000) return "#14b8a6"
	if (income >= 60000) return "#2dd4bf"
	if (income >= 50000) return "#5eead4"
	return "#ccfbf1"
}
export default function MapResponse({ data }: Props) {
	const [mapData, setMapData] = useState(null)

	useEffect(() => {

		try {
			const parsed = JSON.parse(data)
			console.log("@@PARSED", parsed)
			const parseAgain = JSON.parse(parsed)
			console.log("@@AGAIN", parseAgain)
			setMapData(parseAgain)
		} catch (err) {
			setMapData(null)
		}
	}, [])
	if (!mapData) {
		return null
	}

	console.log("@@MapDATa", mapData)

	return <GenericMap
		geoUrl="https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"
		data={mapData.properties.data.map(item => ({
			id: item.id,
			name: item.state,
			value: item.income
		}))}
		colorScale={incomeColorScale}
	/>

}
