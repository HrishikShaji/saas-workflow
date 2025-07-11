"use client"

import { ThemeProvider } from "next-themes";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export default function AppProviders({ children }: { children: ReactNode }) {
	const [queryClient] = useState(() => new QueryClient)
	return <QueryClientProvider client={queryClient}>
		{children}
		{/*
		<ReactQueryDevtools />
*/}

	</QueryClientProvider>
}
