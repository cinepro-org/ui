"use client"
import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Github, Film, Tv, Info, Bug } from "lucide-react"

export default function Footer() {
    return (
        <footer id="footer" className="mt-8 rounded-b-2xl border-t border-border transition-all duration-300 ease-in-out md:py-12">
            <div className="px-4 md:px-6">
                <div className="mb-6 grid grid-cols-2 gap-6 md:mb-8 md:grid-cols-3 md:gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-3 flex items-center gap-2 md:mb-4">
                            <Film className="h-5 w-5 text-primary md:h-6 md:w-6" />
                            <span className="text-lg font-bold text-primary md:text-xl">CinePro/ui</span>
                        </div>
                        <p className="text-xs text-muted-foreground md:text-sm">Your ultimate destination for movies and series. Watch movies and tv shows online for free with no ads or tracking!</p>
                    </div>

                    {/* Pages */}
                    <div>
                        <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold md:mb-4 md:text-base">Pages</h3>
                        <ul className="space-y-1 md:space-y-2">
                            <li>
                                <Link to="/movies" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:text-sm" target="_self" rel="noopener">
                                    <Film className="h-4 w-4" /> Movies
                                </Link>
                            </li>
                            <li>
                                <Link to="/shows" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:text-sm" target="_self" rel="noopener">
                                    <Tv className="h-4 w-4" /> Series
                                </Link>
                            </li>
                            <li>
                                <Link to="/disclaimer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:text-sm" target="_self" rel="noopener">
                                    <Info className="h-4 w-4" /> Disclaimer
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="mb-2 flex items-center gap-1 text-sm font-semibold md:mb-4 md:text-base">Links</h3>
                        <ul className="space-y-1 md:space-y-2">
                            <li>
                                <Link
                                    to="https://github.com/CinePro-Org/ui"
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:text-sm"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <Github className="h-4 w-4" /> GitHub Repository
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="https://github.com/CinePro-Org/ui#readme"
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:text-sm"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <Info className="h-4 w-4" /> About Project
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="https://github.com/CinePro-Org/ui/issues"
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:text-sm"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <Bug className="h-4 w-4" /> Report Issue
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="mb-6 md:mb-8" />

                <div className="flex flex-col items-center justify-between md:flex-row">
                    <p className="text-center text-xs text-muted-foreground md:text-left md:text-sm">
                        © {new Date().getFullYear()} CinePro/ui by{" "}
                        <Link to="https://github.com/CinePro-Org/ui" className="underline" target="_blank" rel="noopener">
                            CinePro
                        </Link>
                        . All rights reserved.
                    </p>

                    <div className="mt-4 flex flex-wrap justify-center gap-4 md:mt-0">
                        <Link
                            to="#footer"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:text-sm"
                            onClick={(e) => {
                                e.preventDefault()
                                toast.success("We do not use/collect any kinds of cookies💪")
                            }}
                        >
                            <Info className="h-4 w-4" /> Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
