import React, { useState } from 'react';
import { JsonFormProps } from './types';
import JsonField from './JsonField';
import { Plus } from 'lucide-react';

const JsonForm: React.FC<JsonFormProps> = ({ onSave }) => {
	const [jsonObject, setJsonObject] = useState<Record<string, any>>({});
	const [newKey, setNewKey] = useState<string>('');

	const handleFieldUpdate = (path: string, value: any, newPath?: string) => {
		if (path === 'root') {
			setJsonObject(value || {});
			return;
		}

		const pathParts = path.split('.');
		const fieldKey = pathParts[pathParts.length - 1];
		const parentPath = pathParts.slice(0, pathParts.length - 1).join('.');

		// Handle renaming a field (key change)
		if (newPath && newPath !== path) {
			const newPathParts = newPath.split('.');
			const newFieldKey = newPathParts[newPathParts.length - 1];
			const newParentPath = newPathParts.slice(0, newPathParts.length - 1).join('.');

			if (parentPath === '') {
				// Top-level field rename
				const updatedJson = { ...jsonObject };
				updatedJson[newFieldKey] = updatedJson[fieldKey];
				delete updatedJson[fieldKey];
				setJsonObject(updatedJson);
			} else {
				// Nested field rename
				const updatedJson = { ...jsonObject };
				let parent = updatedJson;

				// Navigate to the parent object
				for (const part of parentPath.split('.')) {
					parent = parent[part];
				}

				// Rename the field
				parent[newFieldKey] = parent[fieldKey];
				delete parent[fieldKey];

				setJsonObject(updatedJson);
			}
			return;
		}

		// Handle field deletion
		if (value === undefined) {
			if (parentPath === '') {
				// Delete top-level field
				const updatedJson = { ...jsonObject };
				delete updatedJson[fieldKey];
				setJsonObject(updatedJson);
			} else {
				// Delete nested field
				const updatedJson = { ...jsonObject };
				let parent = updatedJson;

				// Navigate to the parent object
				for (const part of parentPath.split('.')) {
					parent = parent[part];
				}

				// Delete the field
				delete parent[fieldKey];

				setJsonObject(updatedJson);
			}
			return;
		}

		// Normal field update
		if (parentPath === '') {
			// Update top-level field
			setJsonObject({
				...jsonObject,
				[fieldKey]: value
			});
		} else {
			// Update nested field
			const updatedJson = { ...jsonObject };
			let current = updatedJson;

			// Navigate to the parent object
			for (const part of parentPath.split('.')) {
				current = current[part];
			}

			// Update the field
			current[fieldKey] = value;

			setJsonObject(updatedJson);
		}
	};

	const handleFieldDelete = (path: string) => {
		const pathParts = path.split('.');
		const fieldKey = pathParts[pathParts.length - 1];
		const parentPath = pathParts.slice(0, pathParts.length - 1).join('.');

		if (parentPath === '') {
			// Delete top-level field
			const updatedJson = { ...jsonObject };
			delete updatedJson[fieldKey];
			setJsonObject(updatedJson);
		} else {
			// Delete nested field
			const updatedJson = { ...jsonObject };
			let parent = updatedJson;

			// Navigate to the parent object
			for (const part of parentPath.split('.')) {
				parent = parent[part];
			}

			// Delete the field
			delete parent[fieldKey];

			setJsonObject(updatedJson);
		}
	};

	const handleAddRootField = () => {
		if (!newKey.trim()) return;

		setJsonObject({
			...jsonObject,
			[newKey]: ''
		});

		setNewKey('');
	};

	const handleSaveJson = () => {
		onSave(jsonObject);
	};

	return (
		<div className="space-y-4">
			<div className="space-y-4">
				{Object.keys(jsonObject).map((key) => (
					<JsonField
						key={key}
						path={key}
						value={jsonObject[key]}
						onUpdate={handleFieldUpdate}
						onDelete={handleFieldDelete}
					/>
				))}
			</div>

			<div className="flex mt-4">
				<input
					type="text"
					value={newKey}
					onChange={(e) => setNewKey(e.target.value)}
					placeholder="New property name"
					className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				/>
				<button
					onClick={handleAddRootField}
					className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
				>
					<Plus className="h-4 w-4" />
				</button>
			</div>

			<div className="mt-6">
				<button
					onClick={handleSaveJson}
					className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
				>
					Save JSON
				</button>
			</div>
		</div>
	);
};

export default JsonForm;

export { JsonForm }
