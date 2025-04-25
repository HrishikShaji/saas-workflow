import { getWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import ExecutionViewer from "@/components/workflow/ExecutionViewer";
import Topbar from "@/components/workflow/Topbar";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default async function Page({ params }: { params: { executionId: string; workflowId: string } }) {

    const { workflowId, executionId } = await params

    return <div className="flex flex-col h-screen w-full overflow-hidden">
        <Topbar workflowId={workflowId}
            title="workflow run details"
            subTitle={`Run ID:${executionId}`}
            hideButtons
        />
        <section className="flex h-full overflow-auto">
            <Suspense fallback={
                <div className="flex w-full items-center justify-center">
                    <Loader className="size-10 animate-spin stroke-primary" />
                </div>
            }>
                <ExecutionViewerWrapper executionId={executionId} />
            </Suspense>
        </section>

    </div>
}

async function ExecutionViewerWrapper({ executionId }: { executionId: string }) {
    const workflowExecution = await getWorkflowExecutionWithPhases(executionId)
    if (!workflowExecution) {
        return <div>Not found</div>
    }

    return <ExecutionViewer initialData={workflowExecution} />
}
