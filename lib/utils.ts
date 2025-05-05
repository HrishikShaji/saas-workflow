import { Document } from "@langchain/core/documents"
import { Pinecone } from "@pinecone-database/pinecone"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { pipeline } from "@huggingface/transformers"

export function cn(...inputs: ClassValue[]) {
        return twMerge(clsx(inputs))
}

export async function updateVectorDB(client: Pinecone, indexName: string, namespace: string, docs: Document[], progressCallback: (fileName: string, total: number, chunksUpserted: number, isComplete: boolean) => void) {
        {/*
        const modelName = "mixedbread-ai/mxbai-embed-large-v1"
        const extractor = await pipeline("feature-extraction", modelName)
        console.log(extractor)
        console.log("these are docs", docs)
        for (const doc of docs) {
                await processDocument(client, indexName, namespace, doc, extractor)
        }
*/}
}

function processDocument(client: Pinecone, indexName: string, namespace: string, doc: Document, extractor: any) {
        console.log(doc)
}
