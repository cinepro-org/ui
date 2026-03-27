import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { LucideCog, LucideFilm, LucideHome, LucideTv } from "lucide-react"
import {useLocation, Link, useNavigate } from "react-router-dom"

export default function SideBar() {
    const { open } = useSidebar()
    const navigate = useNavigate()
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path

    return (
        <Sidebar side={"left"} variant="inset" collapsible={"icon"}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div onClick={() => navigate("/")} className="cursor-pointer text-lg font-semibold" aria-label="CineProV2 home">
                            <div className="flex items-center gap-2">
                                <img src="/favicon.svg" alt="Logo" className="h-14" />
                                <h1
                                    aria-hidden={!open}
                                    className={
                                        "overflow-hidden text-2xl font-bold whitespace-nowrap text-primary transition-all duration-300 ease-in-out " +
                                        (open ? "max-w-50 translate-x-0 scale-100 opacity-100" : "pointer-events-none max-w-0 -translate-x-2 scale-95 opacity-0")
                                    }
                                >
                                    {" "}
                                    CinePro/ui{" "}
                                </h1>
                            </div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Pages</SidebarGroupLabel>
                    <SidebarGroupContent className="flex flex-col gap-2">
                        <SidebarMenu>
                            <SidebarMenuItem className="flex items-center gap-2">
                                <SidebarMenuButton asChild className={`mb-0 min-w-8 bg-primary font-semibold hover:bg-primary active:bg-primary`}>
                                    <Link to="/">
                                        <LucideHome />
                                        <span>Home</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem className="flex items-center gap-2">
                                <SidebarMenuButton asChild className={`mb-0 min-w-8 font-semibold ${isActive("/movies") ? "bg-secondary text-secondary-foreground" : "text-primary-foreground"}`}>
                                    <Link to="/movies">
                                        <LucideFilm />
                                        Movies
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem className="flex items-center gap-2">
                                <SidebarMenuButton asChild className={`mb-0 min-w-8 font-semibold ${isActive("/shows") ? "bg-secondary text-secondary-foreground" : "text-primary-foreground"}`}>
                                    <Link to="/shows">
                                        <LucideTv />
                                        Shows
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem className={`flex items-center gap-2`}>
                        <SidebarMenuButton asChild className={`mb-0 min-w-8 font-semibold ${isActive("/settings") ? "bg-secondary text-secondary-foreground" : "text-primary-foreground"}`}>
                            <Link to="/settings">
                                <LucideCog />
                                Settings
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}