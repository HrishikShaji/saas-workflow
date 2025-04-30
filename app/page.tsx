import { getWorkflowsForUser } from "@/actions/workflows/getWorkflowsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import CreateWorkflowDialog from "@/components/workflow/CreateWorkflowDialog";
import WorkflowCard from "@/components/workflow/WorkflowCard";
import { AlertCircle, InboxIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import { Suspense } from "react";

const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })

export default function Page() {
  return <div className={`${poppins.className} flex-1 flex flex-col h-full p-10`}>
    <div className="flex justify-between">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Workflows</h1>
        <p className="text-muted-foreground">Manage your workflows</p>
      </div>
      <CreateWorkflowDialog />
    </div>
    <div className="h-full py-6">
      <Suspense fallback={<UserFlowsSkeleton />}>
        <UserWorkflows />
      </Suspense>
    </div>
  </div>
}


function UserFlowsSkeleton() {
  return <div className="space-y-2">
    {[1, 2, 3, 4].map((i) => (
      <Skeleton key={i} className="h-32 w-full" />
    ))}
  </div>
}


async function UserWorkflows() {
  const workflows = await getWorkflowsForUser()
  if (!workflows) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong!</AlertDescription>
      </Alert>
    )
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center justify-center">
        <div className="rounded-full bg-accent w-20 h-20 flex justify-center items-center">
          <InboxIcon size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflow created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkflowDialog triggerText="Create your first workflow" />
      </div>
    )
  }
  return <div className="grid grid-cols-1 gap-4">
    {workflows.map((workflow) => (
      <WorkflowCard key={workflow.id} workflow={workflow} />
    ))}
  </div>
}
