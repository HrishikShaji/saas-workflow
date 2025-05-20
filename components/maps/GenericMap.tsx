
import { useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

interface LocationData {
	id: string
	name: string
	value: number
}

interface MapProps {
	geoUrl: string
	data: LocationData[]
	colorScale: (value: number) => string
	tooltipFormatter?: (location: string, value: number) => string
	projectionConfig?: {
		scale?: number
		[key: string]: any
	}
	styleConfig?: {
		default?: React.CSSProperties
		hover?: React.CSSProperties
		pressed?: React.CSSProperties
	}
}

const defaultTooltipFormatter = (location: string, value: number) =>
	`${location}: ${value.toLocaleString()}`

const defaultStyleConfig = {
	default: {
		stroke: "#FFF",
		strokeWidth: 0.5,
		outline: "none",
	},
	hover: {
		fill: "#93c5fd",
		stroke: "#FFF",
		strokeWidth: 0.5,
		outline: "none",
	},
	pressed: {
		fill: "#3b82f6",
		stroke: "#FFF",
		strokeWidth: 0.5,
		outline: "none",
	},
}

export function GenericMap({
	geoUrl,
	data,
	colorScale,
	tooltipFormatter = defaultTooltipFormatter,
	projectionConfig = { scale: 1000 },
	styleConfig = defaultStyleConfig,
}: MapProps) {
	const [tooltipContent, setTooltipContent] = useState("")
	const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

	return (
		<TooltipProvider>
			<ComposableMap
				projection="geoAlbersUsa"
				projectionConfig={projectionConfig}
				className="w-full h-full"
			>
				<Geographies geography={geoUrl}>
					{({ geographies }) =>
						geographies.map((geo) => {
							const locationId = geo.id
							const locationName = geo.properties.name
							const locationData = data.find((item) => item.id === locationId)
							const value = locationData?.value || 0

							return (
								<Tooltip key={geo.rsmKey}>
									<TooltipTrigger asChild>
										<Geography
											geography={geo}
											onClick={() => {
												setSelectedLocation(locationName)
											}}
											onMouseEnter={() => {
												setTooltipContent(tooltipFormatter(locationName, value))
											}}
											onMouseLeave={() => {
												setTooltipContent("")
											}}
											style={{
												default: {
													fill: colorScale(value),
													...styleConfig.default,
												},
												hover: styleConfig.hover,
												pressed: styleConfig.pressed,
											}}
										/>
									</TooltipTrigger>
									<TooltipContent>{tooltipContent}</TooltipContent>
								</Tooltip>
							)
						})
					}
				</Geographies>
			</ComposableMap>
		</TooltipProvider>
	)
}
