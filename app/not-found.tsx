import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <div className="text-center ">
      <h1 className="text-6xl font-bold text-primary mb-4 ">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href={"/"} className="flex items-center justify-center px-4 py-2 bg-primary text-white dark:text-black rounded-md hover:bg-primary/80 transition-colors"><ArrowLeft className="size-4 mr-2" /></Link>
        Back to Dashboard
      </div>
    </div>
  </div>
}
