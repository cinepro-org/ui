import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { SearchDialog } from "@/components/global/SearchDialog.tsx"
import { LucideSearch, Star } from "lucide-react"
import { Kbd } from "@/components/ui/kbd"
import { SidebarTrigger } from "@/components/ui/sidebar.tsx"
import { Link } from "react-router-dom"

export default function Header() {
    const [openCommand, setOpenCommand] = useState(false)

    useEffect(() => {
        const handleOpenSearchCommand = () => {
            setOpenCommand(true)
        }

        window.addEventListener("open-search-command", handleOpenSearchCommand)

        return () => {
            window.removeEventListener("open-search-command", handleOpenSearchCommand)
        }
    }, [])


    return (
        <header className="relative flex h-16 items-center border-b border-border backdrop-blur-sm">
            {/* Left */}
            <SidebarTrigger className="z-10 ml-4" />

            {/* Center */}
            <div className="absolute left-1/2 w-full max-w-[70%] -translate-x-1/2 px-2 sm:max-w-md md:max-w-lg lg:max-w-xl">
                <Button variant="outline" className="flex w-full items-center justify-start text-sm text-muted-foreground" onClick={() => setOpenCommand(true)}>
                    <LucideSearch className="mr-2 h-4 w-4 shrink-0" />

                    {/* Hidden on very small screens */}
                    <span className="hidden sm:inline">Search Movie or TV Show...</span>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Hidden on mobile */}
                    <span className="hidden items-center gap-1 md:flex">
                        <Kbd>⌘</Kbd>+<Kbd>J</Kbd>
                    </span>
                </Button>

                <SearchDialog open={openCommand} setOpen={setOpenCommand} />
            </div>

            {/* Right */}
            <Button variant="ghost" className="z-10 mr-4 ml-auto" asChild>
                <Link to="https://github.com/CinePro-Org/ui" target="_blank" rel="noopener">
                    <Star />
                    <span className="ml-1 hidden sm:inline">GitHub</span>
                </Link>
            </Button>
        </header>
    )
}
