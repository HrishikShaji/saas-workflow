import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
	data: any[];
	dataKey: string; // Key for the value of each pie segment
	nameKey?: string; // Key for the name/label of each segment (defaults to dataKey)
	colors?: string[]; // Custom colors for segments
	innerRadius?: number; // Inner radius for donut chart (default 0 for pie)
	outerRadius?: number; // Outer radius (default 80)
	label?: boolean | ((props: any) => React.ReactNode); // Show labels
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function SimplePieChart({
	data,
	dataKey,
	nameKey,
	colors = COLORS,
	innerRadius = 0,
	outerRadius = 80,
	label = false,
}: Props) {
	// Use nameKey if provided, otherwise fall back to dataKey
	const segmentNameKey = nameKey || dataKey;

	return (
		<ResponsiveContainer width="100%" height="100%">
			<PieChart>
				<Pie
					data={data}
					dataKey={dataKey}
					nameKey={segmentNameKey}
					cx="50%"
					cy="50%"
					innerRadius={innerRadius}
					outerRadius={outerRadius}
					fill="#8884d8"
					label={label}
					paddingAngle={2} // Small gap between segments
				>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
					))}
				</Pie>
				<Tooltip
					formatter={(value: number, name: string, props: any) =>
						[`${value}`, props.payload[segmentNameKey]]
					}
				/>
				<Legend />
			</PieChart>
		</ResponsiveContainer>
	);
}
