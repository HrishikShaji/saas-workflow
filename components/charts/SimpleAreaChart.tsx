import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
	data: any[];
	xAxisKey: string; // Key for X-axis values
	areaKeys?: string[]; // Optional: specify which keys to use for areas
	colors?: string[]; // Optional: specify custom colors for areas
	areaTypes?: ('monotone' | 'linear' | 'step' | 'natural')[]; // Optional: area types
	stacked?: boolean; // Optional: stack areas on top of each other
	gradient?: boolean; // Optional: use gradient fills
}

export default function SimpleAreaChart({
	data,
	xAxisKey,
	areaKeys,
	colors = [],
	areaTypes = [],
	stacked = false,
	gradient = true
}: Props) {
	// If areaKeys not provided, infer them from the first data item (excluding xAxisKey)
	const keysToRender = areaKeys || (data.length > 0
		? Object.keys(data[0]).filter(key => key !== xAxisKey)
		: []);

	// Default colors if not provided
	const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];
	const areaColors = keysToRender.map((_, index) =>
		colors[index] || defaultColors[index % defaultColors.length]
	);

	// Default area types if not provided
	const defaultAreaTypes = ['monotone', 'linear', 'step', 'natural'];
	const areaTypeValues = keysToRender.map((_, index) =>
		areaTypes[index] || defaultAreaTypes[index % defaultAreaTypes.length]
	);

	return (
		<ResponsiveContainer width="100%" height="100%">
			<AreaChart
				data={data}
				margin={{
					top: 10,
					right: 30,
					left: 0,
					bottom: 0,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey={xAxisKey} />
				<YAxis />
				<Tooltip />

				{keysToRender.map((key, index) => (
					<defs key={`gradient-${key}`}>
						{gradient && (
							<linearGradient id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor={areaColors[index]} stopOpacity={0.8} />
								<stop offset="95%" stopColor={areaColors[index]} stopOpacity={0} />
							</linearGradient>
						)}
					</defs>
				))}

				{keysToRender.map((key, index) => (
					<Area
						key={key}
						type={areaTypeValues[index] as any}
						dataKey={key}
						stroke={areaColors[index]}
						fill={gradient ? `url(#color${key})` : areaColors[index]}
						fillOpacity={1}
						stackId={stacked ? "1" : undefined}
						activeDot={{ r: 6 }}
					/>
				))}
			</AreaChart>
		</ResponsiveContainer>
	);
}
