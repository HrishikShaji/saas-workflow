"use client"

import { LucideIcon } from "lucide-react";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface Props {
	title?: string;
	subTitle?: string;
	icon?: LucideIcon;
	iconClassName?: string;
	titleClassName?: string;
	subTitleClassName?: string;
}

export default function CustomDialogHeader({ title, subTitle, icon, iconClassName, titleClassName, subTitleClassName }: Props) {

	const Icon = icon
	return (
		<DialogHeader className="py-6">
			<DialogTitle asChild>
				<div className="flex flex-col items-center gap-2 mb-2">
					{Icon && <Icon className={cn("stroke-primary", iconClassName)} size={30} />}
					{title && (
						<p className={cn("text-xl text-primary", titleClassName)}>{title}</p>
					)}
					{subTitle && (
						<p className={cn("text-sm text-muted-foreground", subTitleClassName)}>{subTitle}</p>
					)}
				</div>
			</DialogTitle>
		</DialogHeader>
	)
}
