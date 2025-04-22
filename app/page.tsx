import Editor from "@/components/workflow/Editor";

export default function Page() {
  return <div className="h-screen p-20 bg-neutral-200">
    <Editor workflow={{ name: "sample" }} />
  </div>
}
