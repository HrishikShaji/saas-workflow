import React from 'react';
import SimpleBarChart from '../charts/SimpleBarChart';
import SimplePieChart from '../charts/SimplePieChart';
import SimpleLineChart from '../charts/SimpleLineChart';
import SimpleAreaChart from '../charts/SimpleAreaChart';

// Define types for the graph data structure
type GraphType = 'barChart' | 'pieChart' | 'lineChart' | 'areaChart';

interface BaseGraphConfig {
	type: GraphType;
	data: any[];
	title?: string;
	className?: string;
	width?: number | string;
	height?: number | string;
}

interface BarChartConfig extends BaseGraphConfig {
	type: 'barChart';
	xAxisKey: string;
	barKeys?: string[];
	colors?: string[];
}

interface PieChartConfig extends BaseGraphConfig {
	type: 'pieChart';
	dataKey: string;
	nameKey?: string;
	colors?: string[];
	innerRadius?: number;
	outerRadius?: number;
	label?: boolean;
}

interface LineChartConfig extends BaseGraphConfig {
	type: 'lineChart';
	xAxisKey: string;
	lineKeys?: string[];
	colors?: string[];
	lineTypes?: ('monotone' | 'linear' | 'step' | 'natural')[];
}

interface AreaChartConfig extends BaseGraphConfig {
	type: 'areaChart';
	xAxisKey: string;
	areaKeys?: string[];
	colors?: string[];
	areaTypes?: ('monotone' | 'linear' | 'step' | 'natural')[];
	stacked?: boolean;
	gradient?: boolean;
}

type GraphConfig = BarChartConfig | PieChartConfig | LineChartConfig | AreaChartConfig;

interface Props {
	data: string; // JSON string containing graph configurations
	className?: string;
	graphClassName?: string;
}

const GraphResponse: React.FC<Props> = ({ data, className = '', graphClassName = '' }) => {
	// Error boundary for JSON parsing
	const parseGraphData = (): GraphConfig[] => {
		try {
			return JSON.parse(data);
		} catch (error) {
			console.error('Failed to parse graph data:', error);
			return [];
		}
	};

	const graphs = parseGraphData();

	if (!graphs || graphs.length === 0) {
		return (
			<div className={`flex items-center justify-center h-[300px] ${className}`}>
				<div className="text-gray-500">No valid graph data available</div>
			</div>
		);
	}

	const renderGraph = (graph: GraphConfig, index: number) => {
		const commonProps = {
			className: graphClassName,
			data: graph.data,
		};

		switch (graph.type) {
			case 'barChart':
				return <SimpleBarChart
					key={index}
					xAxisKey={graph.xAxisKey}
					barKeys={graph.barKeys}
					colors={graph.colors}
					{...commonProps}
				/>;
			case 'pieChart':
				return <SimplePieChart
					key={index}
					dataKey={graph.dataKey}
					nameKey={graph.nameKey}
					colors={graph.colors}
					innerRadius={graph.innerRadius}
					outerRadius={graph.outerRadius}
					label={graph.label}
					{...commonProps}
				/>;
			case 'lineChart':
				return <SimpleLineChart
					key={index}
					xAxisKey={graph.xAxisKey}
					lineKeys={graph.lineKeys}
					colors={graph.colors}
					lineTypes={graph.lineTypes}
					{...commonProps}
				/>;
			case 'areaChart':
				return <SimpleAreaChart
					key={index}
					xAxisKey={graph.xAxisKey}
					areaKeys={graph.areaKeys}
					colors={graph.colors}
					areaTypes={graph.areaTypes}
					stacked={graph.stacked}
					gradient={graph.gradient}
					{...commonProps}
				/>;
			default:
				return (
					<div className="text-center text-gray-500 p-4">
						Unsupported graph type: {(graph as BaseGraphConfig).type}
					</div>
				);
		}
	};

	return (
		<div className={`space-y-8 ${className}`}>
			{graphs.map((graph, index) => (
				<div key={index} className="graph-container">
					{graph.title && (
						<h3 className="text-lg font-medium mb-2 text-center">
							{graph.title}
						</h3>
					)}
					<div className="h-[300px] bg-white rounded-lg shadow p-4">
						{renderGraph(graph, index)}
					</div>
				</div>
			))}
		</div>
	);
};

export default GraphResponse;
