import { NextResponse } from "next/server";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Pinecone } from "@pinecone-database/pinecone"
import { updateVectorDB } from "@/lib/utils";

export async function POST(request: Request) {
	try {
		const { indexName, namespace } = await request.json();

		console.log("this is indexName and namespace", indexName, namespace)
		// Create a transform stream for streaming the response
		const stream = new TransformStream();
		const writer = stream.writable.getWriter();

		{/*
		const loader = new DirectoryLoader("./documents", {
			".pdf": (path: string) => new PDFLoader(path, { splitPages: false }),
			".txt": (path: string) => new TextLoader(path)
		});

		const docs = await loader.load();
		const client = new Pinecone({
			apiKey: process.env.PINECONE_NEW_API_KEY || ""
		});

		// Process the documents and write updates to the stream
		await updateVectorDB(client, indexName, namespace, docs, async (filename, totalChunks, chunksUpserted, isCompleted) => {
			console.log("RUNNING VECTOR DB")
			await writer.write(new TextEncoder().encode(
				JSON.stringify({ filename, totalChunks, chunksUpserted, isCompleted }) + "\n"
			));

			if (isCompleted) {
				await writer.close();
			}
		});

	*/}
		return new NextResponse(stream.readable, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
			},
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
