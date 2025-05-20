import React, { useState } from 'react';
import { ClipboardCopy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import JsonForm from './JsonForm';
import JsonPreview from './JsonPreview';

const JsonBuilder: React.FC = () => {
	const [json, setJson] = useState({});
	const [copied, setCopied] = useState(false);

	const handleSave = (newJson: any) => {
		setJson(newJson);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(JSON.stringify(json, null, 2));
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Card className="overflow-hidden">
			<CardHeader>
				<CardTitle>Build Your JSON Structure</CardTitle>
				<CardDescription>
					Create complex and nested JSON objects with various data types
				</CardDescription>
			</CardHeader>

			<CardContent className="p-0">
				<div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-700">
					<div className="lg:w-1/2 p-6">
						<ScrollArea className="h-[calc(100vh-20rem)]">
							<JsonForm onSave={handleSave} />
						</ScrollArea>
					</div>

					<div className="lg:w-1/2 p-6">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold text-slate-900 dark:text-white">JSON Preview</h3>
							<Button
								onClick={handleCopy}
								variant={copied ? "secondary" : "outline"}
								size="sm"
							>
								<ClipboardCopy className="h-4 w-4 mr-1.5" />
								{copied ? 'Copied!' : 'Copy JSON'}
							</Button>
						</div>
						<ScrollArea className="h-[calc(100vh-24rem)]">
							<JsonPreview json={json} onCopy={handleCopy} />
						</ScrollArea>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default JsonBuilder;
