import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
	data: any[];
	xAxisKey: string;
	barKeys?: string[];
	colors?: string[];
}

export default function SimpleBarChart({ data, xAxisKey, barKeys, colors = [] }: Props) {
	// If barKeys not provided, infer them from the first data item (excluding xAxisKey)
	const keysToRender = barKeys || (data.length > 0
		? Object.keys(data[0]).filter(key => key !== xAxisKey)
		: []);

	// Default colors if not provided
	const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];
	const barColors = keysToRender.map((_, index) =>
		colors[index] || defaultColors[index % defaultColors.length]
	);

	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart
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
					<Bar
						key={key}
						dataKey={key}
						fill={barColors[index]}
						activeBar={{ fill: barColors[index], stroke: '#000', strokeWidth: 1 }}
					/>
				))}
			</BarChart>
		</ResponsiveContainer>
	);
}
