import React, { useState, useEffect } from 'react';
import { JsonFieldProps, JsonFieldType } from './types';
import {
	Type,
	Trash2,
	Plus,
	ChevronDown,
	ChevronRight
} from 'lucide-react';
import JsonObjectField from './JsonObjectField';
import JsonArrayField from './JsonArrayField';

const JsonField: React.FC<JsonFieldProps> = ({
	path,
	onUpdate,
	onDelete,
	value,
	isRoot = false
}) => {
	const getFieldType = (): JsonFieldType => {
		if (value === null) return 'null';
		if (Array.isArray(value)) return 'array';
		return typeof value as JsonFieldType;
	};

	const [fieldType, setFieldType] = useState<JsonFieldType>(getFieldType());
	const [fieldValue, setFieldValue] = useState<any>(value);
	const [isExpanded, setIsExpanded] = useState(true);
	const [key, setKey] = useState<string>(path.split('.').pop() || 'root');

	useEffect(() => {
		setFieldType(getFieldType());
		setFieldValue(value);
	}, [value]);

	const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newType = e.target.value as JsonFieldType;
		let newValue: any;

		switch (newType) {
			case 'string':
				newValue = '';
				break;
			case 'number':
				newValue = 0;
				break;
			case 'boolean':
				newValue = false;
				break;
			case 'array':
				newValue = [];
				break;
			case 'object':
				newValue = {};
				break;
			case 'null':
				newValue = null;
				break;
			default:
				newValue = '';
		}

		setFieldType(newType);
		setFieldValue(newValue);
		onUpdate(path, newValue);
	};

	const handleValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		let newValue: any = e.target.value;

		if (fieldType === 'number') {
			newValue = parseFloat(newValue) || 0;
		} else if (fieldType === 'boolean') {
			newValue = e.target.value === 'true';
		}

		setFieldValue(newValue);
		onUpdate(path, newValue);
	};

	const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newKey = e.target.value;
		setKey(newKey);

		const parts = path.split('.');
		const parentPath = parts.slice(0, parts.length - 1).join('.');
		const newPath = parentPath ? `${parentPath}.${newKey}` : newKey;

		onUpdate(path, undefined, newPath); // Optional third parameter to indicate path change
	};

	const handleToggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const renderFieldValue = () => {
		switch (fieldType) {
			case 'string':
				return (
					<input
						type="text"
						value={fieldValue || ''}
						onChange={handleValueChange}
						className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				);
			case 'number':
				return (
					<input
						type="number"
						value={fieldValue}
						onChange={handleValueChange}
						className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				);
			case 'boolean':
				return (
					<select
						value={String(fieldValue)}
						onChange={handleValueChange}
						className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					>
						<option value="true">true</option>
						<option value="false">false</option>
					</select>
				);
			case 'object':
				return (
					<JsonObjectField
						path={path}
						value={fieldValue}
						onUpdate={onUpdate}
						onDelete={onDelete}
						isExpanded={isExpanded}
						onToggleExpand={handleToggleExpand}
					/>
				);
			case 'array':
				return (
					<JsonArrayField
						path={path}
						value={fieldValue}
						onUpdate={onUpdate}
						onDelete={onDelete}
						isExpanded={isExpanded}
						onToggleExpand={handleToggleExpand}
					/>
				);
			case 'null':
				return (
					<div className="text-gray-500 italic px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
						null
					</div>
				);
			default:
				return null;
		}
	};

	const getTypeColor = () => {
		switch (fieldType) {
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
		<div className={`mb-4 rounded-md ${isRoot ? '' : 'border border-gray-200 p-4'} transition-all duration-200`}>
			<div className="flex items-start mb-2">
				{!isRoot && (
					<>
						<div className="w-1/3 mr-2">
							<input
								type="text"
								value={key}
								onChange={handleKeyChange}
								className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								placeholder="Key name"
							/>
						</div>
						<div className="w-1/4 mr-2">
							<div className="relative">
								<select
									value={fieldType}
									onChange={handleTypeChange}
									className={`block w-full appearance-none px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${getTypeColor()}`}
								>
									<option value="string">String</option>
									<option value="number">Number</option>
									<option value="boolean">Boolean</option>
									<option value="object">Object</option>
									<option value="array">Array</option>
									<option value="null">Null</option>
								</select>
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
									<Type className="h-4 w-4" />
								</div>
							</div>
						</div>
					</>
				)}
				<div className={`${isRoot ? 'w-full' : 'w-5/12'} mr-2`}>
					{renderFieldValue()}
				</div>
				{!isRoot && (
					<button
						onClick={() => onDelete(path)}
						className="p-2 text-gray-400 hover:text-red-500 focus:outline-none transition-colors duration-200"
						title="Delete field"
					>
						<Trash2 className="h-5 w-5" />
					</button>
				)}
			</div>
		</div>
	);
};

export default JsonField;
