import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

interface Props {
	data: any;
}

export default function SimplePieChart({ data }: Props) {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<PieChart width={400} height={400}>
				<Pie data={data} dataKey="queries" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" label />
			</PieChart>
		</ResponsiveContainer>
	);
}
