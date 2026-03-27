import React, { useState, useEffect } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList, CommandItem, CommandGroup, Command } from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"
import { useTmdb } from "@/components/providers/tmdb-provider"
import type { MultiSearchResultItem } from "@lorenzopant/tmdb"
import { useNavigate, useSearchParams } from "react-router-dom"
import { LucidePlay, LucideTv } from "lucide-react"

export function SearchDialog({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const tmdb = useTmdb()
    const navigate = useNavigate()

    const [query, setQuery] = useState("")
    const [results, setResults] = useState<MultiSearchResultItem[]>([])
    const [loading, setLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()


    useEffect(() => {
        const q = searchParams.get("q")

        if (q) {
            setQuery(q)
            setOpen(true)
        }
    }, [searchParams, setOpen, setQuery])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const nav = navigator as Navigator & { userAgentData?: { platform: string } }

            const platform = nav.userAgentData?.platform ?? navigator.userAgent ?? ""
            const isMac = platform.toLowerCase().includes("mac")

            const modKey = isMac ? e.metaKey : e.ctrlKey

            if (modKey && e.key.toLowerCase() === "j") {
                e.preventDefault()
                setOpen(!open)
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [open, setOpen])

    useEffect(() => {
        if (!open) return

        const current = searchParams.get("q") || ""

        if (query === current) return

        const params = new URLSearchParams(searchParams)

        if (query) {
            params.set("q", query)
        } else {
            params.delete("q")
        }

        setSearchParams(params, { replace: true })
    }, [query, open, setSearchParams, searchParams])

    // debounce search
    useEffect(() => {
        if (!query) {
            setResults([])
            return
        }

        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await tmdb.search.multi({
                    query,
                    language: "en-US",
                })
                setResults(res.results ?? [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }, 400)

        return () => clearTimeout(timer)
    }, [query, tmdb])

    const handleSelect = (item: MultiSearchResultItem) => {
        setOpen(false)
        setQuery("")

        setSearchParams({}, { replace: true })

        if (item.media_type === "movie") {
            navigate(`/movie/${item.id}`)
        } else if (item.media_type === "tv") {
            navigate(`/show/${item.id}`)
        }
    }
    // group results
    const movies = results.filter((r) => r.media_type === "movie").slice(0, 5)
    const tv = results.filter((r) => r.media_type === "tv").slice(0, 5)

    const getImageUrl = (path?: string | null) => (path ? `https://image.tmdb.org/t/p/w92${path}` : null)

    const renderItem = (item: MultiSearchResultItem) => {
        let title = ""
        let subtitle = ""
        let image = ""
        let rating: number | null = null
        let icon = null

        if (item.media_type === "movie") {
            title = item.title
            subtitle = item.release_date || "—"
            image = getImageUrl(item.poster_path) || ""
            rating = item.vote_average
            icon = <LucidePlay className="h-4 w-4" />
        }

        if (item.media_type === "tv") {
            title = item.name
            subtitle = item.first_air_date || "—"
            image = getImageUrl(item.poster_path) || ""
            rating = item.vote_average
            icon = <LucideTv className="h-4 w-4" />
        }

        return (
            <CommandItem key={`${item.media_type}-${item.id}`} value={title} onSelect={() => handleSelect(item)} className="flex items-center gap-3">
                {/* Poster / Avatar */}
                {image ? (
                    <img src={image} alt={title} className="h-14 w-10 shrink-0 rounded-md object-cover" />
                ) : (
                    <div className="flex h-14 w-10 items-center justify-center rounded-md bg-muted">{icon}</div>
                )}

                {/* Text */}
                <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium">{title}</span>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{subtitle}</span>

                        {rating !== null && <span className="flex items-center gap-1">⭐ {rating.toFixed(1)}</span>}
                    </div>
                </div>
            </CommandItem>
        )
    }

    return (
        <CommandDialog
            open={open}
            onOpenChange={(o) => {
                setOpen(o)
                if (!o) {
                    setSearchParams({}, { replace: true })
                }
            }}
        >
            <Command>
                <CommandInput placeholder="Search movies, TV shows, or people..." value={query} onValueChange={setQuery} />

                <CommandList>
                    {loading && (
                        <div className="space-y-2 p-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-4 w-full" />
                            ))}
                        </div>
                    )}

                    {!loading && query.length === 0 && <CommandEmpty>Let the force guide your search...</CommandEmpty>}

                    {!loading && query.length > 0 && results.length === 0 && <CommandEmpty>Hmm... Lost you are... Found results are not <span className={"italic text-muted-foreground"}>- Yoda</span></CommandEmpty>}

                    {!loading && movies.length > 0 && <CommandGroup heading="Movies">{movies.map(renderItem)}</CommandGroup>}

                    {!loading && tv.length > 0 && <CommandGroup heading="TV Shows">{tv.map(renderItem)}</CommandGroup>}
                </CommandList>
            </Command>
        </CommandDialog>
    )
}
