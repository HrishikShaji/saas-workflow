import React from 'react';
import { JsonPreviewProps } from './types';

const JsonPreview: React.FC<JsonPreviewProps> = ({ json }) => {
	const formatJson = (obj: any): string => {
		return JSON.stringify(obj, null, 2);
	};

	const highlightJson = (jsonString: string): React.ReactNode => {
		// Split the json string by line
		const lines = jsonString.split('\n');

		return (
			<>
				{lines.map((line, index) => {
					// Highlight keys (between quotes and before colon)
					const keyHighlighted = line.replace(/"([^"]+)":/g, '<span class="text-purple-600 font-medium">"$1"</span>:');

					// Highlight string values (between quotes after colon)
					const stringHighlighted = keyHighlighted.replace(/: "([^"]+)"/g, ': <span class="text-green-600">"$1"</span>');

					// Highlight numbers
					const numberHighlighted = stringHighlighted.replace(/: ([0-9]+\.?[0-9]*)/g, ': <span class="text-blue-600">$1</span>');

					// Highlight booleans and null
					const booleanHighlighted = numberHighlighted
						.replace(/: (true|false)/g, ': <span class="text-amber-600">$1</span>')
						.replace(/: (null)/g, ': <span class="text-gray-500">$1</span>');

					return (
						<div
							key={index}
							className="whitespace-pre font-mono text-sm"
							dangerouslySetInnerHTML={{ __html: booleanHighlighted }}
						/>
					);
				})}
			</>
		);
	};

	return (
		<div className="h-full overflow-auto rounded-md border border-gray-200 bg-gray-50">
			<pre className="p-4 text-gray-800">
				{highlightJson(formatJson(json))}
			</pre>
		</div>
	);
};

export default JsonPreview;

export { JsonPreview }
