import { ReactNode } from "react";
import { ThemeProvider } from "next-themes"

export function AppProviders({ children }: { children: ReactNode }) {
	return <ThemeProvider attribute="class" defaultTheme="system">
		{children}
	</ThemeProvider>
}
