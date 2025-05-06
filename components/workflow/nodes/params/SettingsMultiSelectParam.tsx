import React, { useEffect, useId, useState } from "react";
import { Check, ChevronsUpDown, GripVertical, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MultiSelectOrderedProps {
	options: string[];
	value: string[];
	onChange: (value: string[]) => void;
	label?: string;
	placeholder?: string;
	helperText?: string;
	required?: boolean;
	disabled?: boolean;
	className?: string;
}

export default function NodeSettingsMultiSelectParam({
	options,
	value,
	onChange,
	label,
	placeholder = "Select items...",
	helperText,
	required = false,
	disabled = false,
	className,
}: MultiSelectOrderedProps) {
	const id = useId();
	const [isOpen, setIsOpen] = useState(false);
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

	// Filter out options that are already selected
	const availableOptions = options.filter((option) => !value.includes(option));

	const handleSelect = (option: string) => {
		onChange([...value, option]);
		setIsOpen(false);
	};

	const handleRemove = (option: string) => {
		onChange(value.filter((item) => item !== option));
	};

	const handleDragStart = (index: number) => {
		setDraggedIndex(index);
	};

	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		if (draggedIndex === null || draggedIndex === index) return;

		const newOrder = [...value];
		const draggedItem = newOrder[draggedIndex];

		// Remove the dragged item
		newOrder.splice(draggedIndex, 1);
		// Insert it at the new position
		newOrder.splice(index, 0, draggedItem);

		onChange(newOrder);
		setDraggedIndex(index);
	};

	const handleDragEnd = () => {
		setDraggedIndex(null);
	};

	const moveItem = (fromIndex: number, direction: "up" | "down") => {
		if (
			(direction === "up" && fromIndex === 0) ||
			(direction === "down" && fromIndex === value.length - 1)
		) {
			return;
		}

		const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
		const newOrder = [...value];
		const [movedItem] = newOrder.splice(fromIndex, 1);
		newOrder.splice(toIndex, 0, movedItem);

		onChange(newOrder);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (isOpen && !(e.target as Element).closest(`#${id}-dropdown`)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, id]);

	return (
		<div className={cn("space-y-1 w-full", className)}>
			{label && (
				<Label htmlFor={id} className="text-xs flex">
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</Label>
			)}

			<div className="relative" id={`${id}-dropdown`}>
				{/* Selected items */}
				<div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 pr-10 py-2 text-sm shadow-sm">
					{value.length > 0 ? (
						<div className="flex flex-col gap-1.5">
							{value.map((item, index) => (
								<div
									key={`${item}-${index}`}
									className={cn(
										"group flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-2 py-1 transition-colors",
										draggedIndex === index && "border-primary opacity-50",
										disabled && "opacity-50 cursor-not-allowed"
									)}
									draggable={!disabled}
									onDragStart={() => handleDragStart(index)}
									onDragOver={(e) => handleDragOver(e, index)}
									onDragEnd={handleDragEnd}
								>
									<div className="flex items-center gap-2">
										<div
											className="cursor-grab touch-none opacity-60 group-hover:opacity-100"
											aria-label="Drag to reorder"
										>
											<GripVertical size={16} />
										</div>
										<span>{item}</span>
									</div>
									<div className="flex items-center">
										<button
											type="button"
											className="p-1 hover:text-red-500 transition-colors"
											onClick={() => handleRemove(item)}
											disabled={disabled}
											aria-label={`Remove ${item}`}
										>
											<X size={14} />
										</button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex h-8 items-center text-muted-foreground">
							{placeholder}
						</div>
					)}
				</div>

				{/* Dropdown trigger */}
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					disabled={disabled || availableOptions.length === 0}
					className={cn(
						"absolute right-0 top-0 h-full px-3 flex items-center",
						availableOptions.length === 0 && "opacity-50 cursor-not-allowed"
					)}
					aria-label="Toggle dropdown"
					aria-expanded={isOpen}
					aria-controls={`${id}-dropdown-menu`}
				>
					<ChevronsUpDown size={16} />
				</button>

				{/* Dropdown menu */}
				{isOpen && availableOptions.length > 0 && (
					<div
						id={`${id}-dropdown-menu`}
						className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 shadow-lg"
					>
						{availableOptions.length > 0 ? (
							availableOptions.map((option) => (
								<div
									key={option}
									className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
									onClick={() => handleSelect(option)}
								>
									<span>{option}</span>
									<Check size={16} className="opacity-0" />
								</div>
							))
						) : (
							<div className="px-3 py-2 text-gray-500">No more options available</div>
						)}
					</div>
				)}
			</div>

			{helperText && (
				<p className="text-muted-foreground px-1 text-xs">{helperText}</p>
			)}
		</div>
	);
}
