import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
	data: any;
}

export default function SimpleBarChart({ data }: Props) {
	console.log("bar chart data", data)
	return (
		<ResponsiveContainer width="100%" height="100%">
			<BarChart
				width={500}
				height={300}
				data={data}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="email" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="queries" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
				<Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
			</BarChart>
		</ResponsiveContainer>
	);
}
