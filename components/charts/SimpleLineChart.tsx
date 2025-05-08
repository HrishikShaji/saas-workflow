import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
	data: any[];
	xAxisKey: string; // Key to use for the X-axis
	lineKeys?: string[]; // Optional: specify which keys to use for lines
	colors?: string[]; // Optional: specify custom colors for lines
	lineTypes?: ('monotone' | 'linear' | 'step' | 'natural')[]; // Optional: line types
}

export default function SimpleLineChart({
	data,
	xAxisKey,
	lineKeys,
	colors = [],
	lineTypes = []
}: Props) {
	// If lineKeys not provided, infer them from the first data item (excluding xAxisKey)
	const keysToRender = lineKeys || (data.length > 0
		? Object.keys(data[0]).filter(key => key !== xAxisKey)
		: []);

	// Default colors if not provided
	const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];
	const lineColors = keysToRender.map((_, index) =>
		colors[index] || defaultColors[index % defaultColors.length]
	);

	// Default line types if not provided
	const defaultLineTypes = ['monotone', 'linear', 'step', 'natural'];
	const lineTypeValues = keysToRender.map((_, index) =>
		lineTypes[index] || defaultLineTypes[index % defaultLineTypes.length]
	);

	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart
				data={data}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey={xAxisKey} />
				<YAxis />
				<Tooltip />
				<Legend />
				{keysToRender.map((key, index) => (
					<Line
						key={key}
						type={lineTypeValues[index] as any}
						dataKey={key}
						stroke={lineColors[index]}
						activeDot={{ r: 8 }}
						strokeWidth={2}
					/>
				))}
			</LineChart>
		</ResponsiveContainer>
	);
}
