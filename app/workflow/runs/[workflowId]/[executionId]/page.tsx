import { getWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import ExecutionViewer from "@/components/workflow/ExecutionViewer";
import Topbar from "@/components/workflow/Topbar";
import { Loader } from "lucide-react";
import { Poppins } from "next/font/google";
import { Suspense } from "react";

const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })

type tParams = Promise<{ workflowId: string; executionId: string }>;

export default async function Page({ params }: { params: tParams }) {

    const { workflowId, executionId } = await params

    return <div className={`flex flex-col h-screen w-full overflow-hidden ${poppins.className}`}>
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
