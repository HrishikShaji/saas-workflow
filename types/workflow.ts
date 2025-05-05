import { LucideProps } from "lucide-react";
import { TaskParam, TaskType } from "./task";
import { AppNode } from "./appNode";
import { SettingsParam } from "./settings";

export enum WorkflowStatus {
        DRAFT = "DRAFT",
        PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
        label: string;
        icon: React.FC<LucideProps>;
        type: TaskType;
        isEntryPoint?: boolean;
        inputs: TaskParam[];
        outputs: TaskParam[];
        settings: SettingsParam[];
        credits: number;
}

export type WorkflowExecutionPlanPhase = {
        phase: number;
        nodes: AppNode[];
}

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[]


export enum WorkflowExecutionStatus {
        PENDING = "PENDING",
        RUNNING = "RUNNING",
        COMPLETED = "COMPLETED",
        FAILED = "FAILED"
}
export enum WorkflowExecutionTrigger {
        MANUAL = "MANUAL"
}
export enum ExecutionPhaseStatus {
        CREATED = "CREATED",
        PENDING = "PENDING",
        RUNNING = "RUNNING",
        COMPLETED = "COMPLETED",
        FAILED = "FAILED"
}

