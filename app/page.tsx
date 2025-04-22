import { getWorkflowsForUser } from "@/actions/workflows/getWorkflowsForUser";
import Editor from "@/components/workflow/Editor";

export default async function Page() {

  const workflows = await getWorkflowsForUser()

  console.log("these are workflows", workflows)

  return <div className="h-screen p-20 bg-neutral-200">
    <Editor workflow={{ name: "sample" }} />
  </div>
}
