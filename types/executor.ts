import { Record } from "@/lib/generated/prisma/runtime/library";
import { Browser, Page } from "puppeteer";
import { WorkflowTask } from "./workflow";
import { LogCollector } from "./log";
import { DataSource } from "typeorm";
import { MongoDBConnectionResult } from "@/lib/connectToMongoDB";

export type EnvironmentDatabase = {
        provider: "mongodb" | "postgres" | "mysql" | "sqlite" | "postgresql",
        instance: MongoDBConnectionResult | undefined;
}

export type Environment = {
        browser?: Browser;
        page?: Page;
        database?: EnvironmentDatabase;
        phases: Record<
                string,
                {
                        inputs: Record<string, string>;
                        outputs: Record<string, string>;
                        settings: Record<string, string>;
                }
        >
}

export type ExecutionEnvironment<T extends WorkflowTask> = {
        getInput(name: T["inputs"][number]["name"]): string;
        getSetting(name: T["settings"][number]["name"]): string;
        setOutput(name: T["outputs"][number]["name"], value: string): void;
        getBrowser(): Browser | undefined;
        setBrowser(browser: Browser): void;
        setDatabase(database: EnvironmentDatabase): void;
        getDatabase(): EnvironmentDatabase | undefined;
        getPage(): Page | undefined;
        setPage(page: Page): void;
        log: LogCollector
}
