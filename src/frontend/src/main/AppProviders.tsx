import { TooltipProvider } from "@/components/ui/tooltip"
import { type ReactNode, useEffect } from "react"
import Lenis from "lenis"
import { OmssProvider } from "@/components/providers/omss-provider"
import { TMDBProvider } from "@/components/providers/tmdb-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/providers/theme-provider"

export default function AppProviders({ children }: { children: ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({ autoRaf: true })
        return () => lenis.destroy()
    }, [])

    return (
        <ThemeProvider defaultTheme="dark">
            <TooltipProvider>
                <TMDBProvider apiKey={import.meta.env.VITE_TMDB_API_KEY}>
                    <OmssProvider>
                        <SidebarProvider>
                            {children}
                        </SidebarProvider>
                    </OmssProvider>
                </TMDBProvider>
            </TooltipProvider>
        </ThemeProvider>
    )
}
