import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
	data: any;
}

export default function SimpleLineChart({ data }: Props) {

	return (
		<ResponsiveContainer width="100%" height="100%">
			<LineChart
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
				<XAxis dataKey="date" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line type="monotone" dataKey="queries" stroke="#8884d8" activeDot={{ r: 8 }} />
				<Line type="monotone" dataKey="queries" stroke="#82ca9d" />
			</LineChart>
		</ResponsiveContainer>
	);
}
