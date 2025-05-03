"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { DatabaseIcon, LucideLoader2, RefreshCw } from "lucide-react";
import { use, useState } from "react";

export default function Page() {
  const [isUploading, setIsUploading] = useState(false)
  const [indexName, setIndexName] = useState("")
  const [namespace, setNamespace] = useState("")

  const onStartUpload = async () => {
    const response = await fetch("api/updatedatabase", {
      method: "POST",
      body: JSON.stringify({ indexName, namespace })
    })

    console.log(response)

    //  await process

  }
  return <div className="flex flex-col items-center p-24">
    <Card>
      <CardHeader>
        <CardTitle>Update knowledge base</CardTitle>
        <CardDescription>Add new documents to your vector DB</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 grid gap-4 border rounded-lg p-6">
            <div className="gap-4">
              <Button className="absolute -right-4 -top-4 " size="icon">
                <RefreshCw />
              </Button>
              <Label>Files List:</Label>
              <Textarea readOnly
                className="min-h-24 resize-none border p-3 shadow-none disabled:cursor-default text-sm text-muted-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Index name</Label>
                <Input placeholder="index name" value={indexName} onChange={(e) => setIndexName(e.target.value)} disabled={isUploading} />
              </div>
              <div className="grid gap-2">
                <Label>Namespace</Label>
                <Input placeholder="namespace" value={namespace} onChange={(e) => setNamespace(e.target.value)} disabled={isUploading} />
              </div>
            </div>
          </div>
          <Button onClick={onStartUpload} className="w-full h-full" disabled={isUploading}>
            <DatabaseIcon />
          </Button>
        </div>
        {isUploading && (
          <div className="mt-4">
            <Label>File name:</Label>
            <div className="flex flex-row items-center gap-4">
              <Progress value={80} />
              <LucideLoader2 className="stroke-red-500 animate-spin" />
            </div>
          </div>

        )}
      </CardContent>
    </Card>
  </div>
}
