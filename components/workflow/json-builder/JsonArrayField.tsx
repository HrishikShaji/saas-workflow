import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { JsonFieldProps } from './types';
import JsonField from './JsonField';

interface JsonArrayFieldProps extends Omit<JsonFieldProps, 'isRoot'> {
	isExpanded: boolean;
	onToggleExpand: () => void;
}

const JsonArrayField: React.FC<JsonArrayFieldProps> = ({
	path,
	value,
	onUpdate,
	onDelete,
	isExpanded,
	onToggleExpand
}) => {
	const [newItemType, setNewItemType] = useState<string>('string');

	const getDefaultValueForType = (type: string): any => {
		switch (type) {
			case 'string': return '';
			case 'number': return 0;
			case 'boolean': return false;
			case 'object': return {};
			case 'array': return [];
			case 'null': return null;
			default: return '';
		}
	};

	const handleAddItem = () => {
		const defaultValue = getDefaultValueForType(newItemType);
		const updatedArray = [...value, defaultValue];
		onUpdate(path, updatedArray);
	};

	const handleItemUpdate = (itemPath: string, itemValue: any) => {
		const pathParts = itemPath.split('.');
		const itemIndex = parseInt(pathParts[pathParts.length - 1], 10);

		const updatedArray = [...value];
		updatedArray[itemIndex] = itemValue;

		onUpdate(path, updatedArray);
	};

	const handleItemDelete = (itemPath: string) => {
		const pathParts = itemPath.split('.');
		const itemIndex = parseInt(pathParts[pathParts.length - 1], 10);

		const updatedArray = [...value];
		updatedArray.splice(itemIndex, 1);

		onUpdate(path, updatedArray);
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'string': return 'text-green-600 bg-green-50 border-green-200';
			case 'number': return 'text-blue-600 bg-blue-50 border-blue-200';
			case 'boolean': return 'text-purple-600 bg-purple-50 border-purple-200';
			case 'object': return 'text-amber-600 bg-amber-50 border-amber-200';
			case 'array': return 'text-red-600 bg-red-50 border-red-200';
			case 'null': return 'text-gray-600 bg-gray-50 border-gray-200';
			default: return 'text-gray-600 bg-gray-50 border-gray-200';
		}
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
					{value.length} {value.length === 1 ? 'item' : 'items'}
				</span>
			</div>

			{isExpanded && (
				<div className="pl-4 border-l-2 border-gray-100">
					{value.map((item: any, index: number) => (
						<div key={`${path}.${index}`} className="flex items-center mb-2">
							<span className="text-xs text-gray-500 w-6 mr-2 text-right">{index}:</span>
							<div className="flex-grow">
								<JsonField
									path={`${path}.${index}`}
									value={item}
									onUpdate={handleItemUpdate}
									onDelete={handleItemDelete}
								/>
							</div>
						</div>
					))}

					<div className="flex mt-2">
						<select
							value={newItemType}
							onChange={(e) => setNewItemType(e.target.value)}
							className={`block w-1/3 appearance-none px-3 py-2 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${getTypeColor(newItemType)}`}
						>
							<option value="string">String</option>
							<option value="number">Number</option>
							<option value="boolean">Boolean</option>
							<option value="object">Object</option>
							<option value="array">Array</option>
							<option value="null">Null</option>
						</select>
						<button
							onClick={handleAddItem}
							className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
						>
							<Plus className="h-4 w-4" />
							<span className="ml-1">Add Item</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default JsonArrayField;
