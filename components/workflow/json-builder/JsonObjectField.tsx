import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { JsonFieldProps } from './types';
import JsonField from './JsonField';

interface JsonObjectFieldProps extends Omit<JsonFieldProps, 'isRoot'> {
	isExpanded: boolean;
	onToggleExpand: () => void;
}

const JsonObjectField: React.FC<JsonObjectFieldProps> = ({
	path,
	value,
	onUpdate,
	onDelete,
	isExpanded,
	onToggleExpand
}) => {
	const [newKey, setNewKey] = useState('');

	const handleAddField = () => {
		if (!newKey.trim()) return;

		const updatedValue = { ...value };
		updatedValue[newKey] = '';

		onUpdate(path, updatedValue);
		setNewKey('');
	};

	const handleFieldUpdate = (fieldPath: string, fieldValue: any, newPath?: string) => {
		const pathParts = fieldPath.split('.');
		const fieldKey = pathParts[pathParts.length - 1];

		if (newPath && newPath !== fieldPath) {
			// Handle key rename
			const newPathParts = newPath.split('.');
			const newFieldKey = newPathParts[newPathParts.length - 1];

			const updatedValue = { ...value };
			delete updatedValue[fieldKey];
			updatedValue[newFieldKey] = fieldValue;

			onUpdate(path, updatedValue);
		} else if (fieldValue === undefined) {
			// Handle field deletion
			const updatedValue = { ...value };
			delete updatedValue[fieldKey];

			onUpdate(path, updatedValue);
		} else {
			// Handle normal value update
			const updatedValue = { ...value };
			updatedValue[fieldKey] = fieldValue;

			onUpdate(path, updatedValue);
		}
	};

	const handleFieldDelete = (fieldPath: string) => {
		const pathParts = fieldPath.split('.');
		const fieldKey = pathParts[pathParts.length - 1];

		const updatedValue = { ...value };
		delete updatedValue[fieldKey];

		onUpdate(path, updatedValue);
	};

	return (
		<div className="border border-gray-200 rounded-md p-2 bg-white">
			<div className="flex items-center mb-2">
				<button
					onClick={onToggleExpand}
					className="text-gray-500 hover:text-gray-700 focus:outline-none mr-1"
				>
					{isExpanded ? (
						<ChevronDown className="h-4 w-4" />
					) : (
						<ChevronRight className="h-4 w-4" />
					)}
				</button>
				<span className="text-sm font-medium text-gray-700">
					{Object.keys(value).length} {Object.keys(value).length === 1 ? 'property' : 'properties'}
				</span>
			</div>

			{isExpanded && (
				<div className="pl-4 border-l-2 border-gray-100">
					{Object.keys(value).map((key) => (
						<JsonField
							key={`${path}.${key}`}
							path={`${path}.${key}`}
							value={value[key]}
							onUpdate={handleFieldUpdate}
							onDelete={handleFieldDelete}
						/>
					))}

					<div className="flex mt-2">
						<input
							type="text"
							value={newKey}
							onChange={(e) => setNewKey(e.target.value)}
							placeholder="New property name"
							className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
						<button
							onClick={handleAddField}
							className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
						>
							<Plus className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default JsonObjectField;
