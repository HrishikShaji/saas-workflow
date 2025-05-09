import { nodeSettings } from "@/lib/constants";
import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Bot, File, GlobeIcon, LucideProps } from "lucide-react";

const entityOptions = [
	{ value: 'people', label: 'People' },
	{ value: 'organizations', label: 'Organizations' },
	{ value: 'places', label: 'Places' },
	{ value: 'dates', label: 'Dates' },
	{ value: 'values', label: 'Values' },
	{ value: 'money', label: 'Money' },
	{ value: 'percentages', label: 'Percentages' },
	{ value: 'possessives', label: 'Possessives' },
	{ value: 'acronyms', label: 'Acronyms' },
	{ value: 'quotes', label: 'Quotes' },
	{ value: 'emailAddresses', label: 'Email Addresses' },
	{ value: 'phoneNumbers', label: 'Phone Numbers' },
	{ value: 'urls', label: 'URLs' },
	{ value: 'hashtags', label: 'Hashtags' },
	{ value: 'mentions', label: 'Mentions' },
	{ value: 'ipAddresses', label: 'IP Addresses' },
	{ value: 'creditCards', label: 'Credit Cards' },
	{ value: 'times', label: 'Times' },
	{ value: 'nouns', label: 'Nouns' },
	{ value: 'verbs', label: 'Verbs' },
	{ value: 'adjectives', label: 'Adjectives' }
];

export const EntityExtractorTask = {
	type: TaskType.ENTITY_EXTRACTOR,
	label: "Entity Extractor",
	icon: (props: LucideProps) => (
		<File className="stroke-pink-500" {...props} />
	),
	isEntryPoint: true,
	inputs: [
		{
			name: "input",
			type: TaskParamType.STRING,
			helperText: "Text to examine",
			required: true,
			hideHandle: true
		},
		{
			name: "entities",
			type: TaskParamType.SELECT,
			helperText: "Entities to extract",
			required: true,
			hideHandle: true,
			value: JSON.stringify(entityOptions)
		},

	] as const,
	outputs: [
		{ name: "AI Response", type: TaskParamType.AI_RESPONSE }
	] as const,
	settings: nodeSettings,
	credits: 5
} satisfies WorkflowTask
