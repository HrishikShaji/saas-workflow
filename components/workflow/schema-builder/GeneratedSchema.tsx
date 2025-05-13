import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GeneratedSchemaProps {
	schema: string;
}

export function GeneratedSchema({ schema }: GeneratedSchemaProps) {
	const copyToClipboard = () => {
		navigator.clipboard.writeText(schema);
		toast('Schema copied to clipboard!');
	};

	if (!schema) return null;

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-medium">Generated Zod Schema</h3>
				<Button
					variant="ghost"
					size="sm"
					onClick={copyToClipboard}
					className="h-7 px-2 text-xs"
				>
					<Copy className="h-3 w-3 mr-1" />
					Copy
				</Button>
			</div>
			<pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto max-h-[200px]">
				{schema}
			</pre>
		</div>
	);
}
