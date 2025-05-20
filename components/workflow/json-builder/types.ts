export type JsonFieldType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null';

export interface JsonFieldProps {
	path: string;
	onUpdate: (path: string, value: any) => void;
	onDelete: (path: string) => void;
	value: any;
	isRoot?: boolean;
}

export interface JsonFormProps {
	onSave: (json: any) => void;
}

export interface JsonPreviewProps {
	json: any;
	onCopy: () => void;
}

export interface JsonPathMap {
	[path: string]: {
		type: JsonFieldType;
		value: any;
	};
}
