import React from 'react';
import SimpleAreaChart from "../charts/SimpleAreaChart";
import SimpleBarChart from "../charts/SimpleBarChart";
import SimpleLineChart from "../charts/SimpleLineChart";
import SimplePieChart from "../charts/SimplePieChart";

// Define types for the graph data structure
type GraphType = 'barChart' | 'pieChart' | 'lineChart' | 'areaChart';

interface GraphConfig {
	type: GraphType;
	data: any[];
	title?: string;
	// Add other common chart configuration options here
	// width?: number;
	// height?: number;
	// colors?: string[];
}

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
				return <SimpleBarChart key={index} {...commonProps} />;
			case 'pieChart':
				return <SimplePieChart key={index} {...commonProps} />;
			case 'lineChart':
				return <SimpleLineChart key={index} {...commonProps} />;
			case 'areaChart':
				return <SimpleAreaChart key={index} {...commonProps} />;
			default:
				return (
					<div className="text-center text-gray-500 p-4">
						Unsupported graph type: {graph.type}
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
