// components/movie/MovieMain.tsx
import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import { useNavigate } from "react-router-dom"
import type { Source, Subtitle } from "@omss/sdk"
import type { MovieResultItem } from "@lorenzopant/tmdb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Types ────────────────────────────────────────────────────────────────────

interface MovieMainProps {
    sources: Source[]
    subtitles: Subtitle[]
    similar: MovieResultItem[]
    recommendations: MovieResultItem[]
    sourcesLoading: boolean
}

const getUniqueId = (s: Source) => `${s.url}__${s.quality}__${s.provider.name}`

const TMDB_IMG = (path: string | null, size = "w342") => (path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png")

function MovieCarousel({ title, items }: { title: string; items: MovieResultItem[] }) {
    const navigate = useNavigate()

    if (!items.length) return null

    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold tracking-tight">{title}</h3>
            <ScrollArea className="w-full rounded-lg whitespace-nowrap">
                <div className="flex gap-3 pb-4">
                    {items.map((movie) => (
                        <button
                            key={movie.id}
                            onClick={() => navigate(`/movie/${movie.id}`)}
                            className="group relative w-[120px] shrink-0 overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <img src={TMDB_IMG(movie.poster_path ?? '')} alt={movie.title} className="h-[180px] w-full object-cover" loading="lazy" />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <p className="truncate text-xs font-medium text-white">{movie.title}</p>
                                <p className="text-[10px] text-white/60">⭐ {movie.vote_average?.toFixed(1)}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}

// ─── Player ───────────────────────────────────────────────────────────────────

function OmssPlayer({ sources, subtitles }: { sources: Source[]; subtitles: Subtitle[] }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const hlsRef = useRef<Hls | null>(null)

    const [selectedId, setSelectedId] = useState<string>(() => (sources.length ? getUniqueId(sources[0]) : ""))

    const selectedSource = sources.find((s) => getUniqueId(s) === selectedId) ?? sources[0] ?? null

    // Attach HLS or native src whenever the selected source changes
    useEffect(() => {
        if (!selectedSource || !videoRef.current) return

        const video = videoRef.current

        // Tear down any existing HLS instance
        if (hlsRef.current) {
            hlsRef.current.destroy()
            hlsRef.current = null
        }

        const isHls = selectedSource.type === "hls" || selectedSource.url.includes(".m3u8")

        if (isHls) {
            if (Hls.isSupported()) {
                const hls = new Hls({ enableWorker: true })
                hls.loadSource(selectedSource.url)
                hls.attachMedia(video)
                hlsRef.current = hls
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                // Native HLS (Safari)
                video.src = selectedSource.url
            }
        } else {
            video.src = selectedSource.url
        }

        video.play().catch(() => {
            /* autoplay may be blocked */
        })

        return () => {
            hlsRef.current?.destroy()
            hlsRef.current = null
        }
    }, [selectedSource])

    if (!selectedSource) {
        return <div className="flex h-56 w-full items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 text-sm text-muted-foreground">No sources available</div>
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Video element – src managed by effect above */}
            <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-xl">
                <video ref={videoRef} controls playsInline className="aspect-video w-full">
                    {subtitles.map((sub, i) => (
                        <track key={i} src={sub.url} kind="subtitles" srcLang={sub.label} label={sub.label} default={i === 0} />
                    ))}
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Controls row */}
            <div className="flex flex-wrap items-center gap-3">
                {sources.length > 1 && (
                    <Select value={selectedId} onValueChange={setSelectedId}>
                        <SelectTrigger className="w-56">
                            <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                            {sources.map((s) => (
                                <SelectItem key={getUniqueId(s)} value={getUniqueId(s)}>
                                    {s.quality} — {s.provider.name}
                                    <span className="ml-2 text-xs text-muted-foreground uppercase">{s.type}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {selectedSource.audioTracks.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {selectedSource.audioTracks.map((t) => (
                            <Badge key={t.language} variant="outline" className="text-xs">
                                🔊 {t.label}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function MovieMain({ sources, subtitles, similar, recommendations, sourcesLoading }: MovieMainProps) {
    return (
        <div className="flex min-w-0 flex-1 flex-col gap-8">
            {/* Player */}
            {sourcesLoading ? (
                <Skeleton className="aspect-video w-full rounded-xl" />
            ) : sources.length !== 0 ? (
                <OmssPlayer sources={sources} subtitles={subtitles} />
            ) : (
                <div className="flex text-center h-56 w-full items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 text-sm text-muted-foreground">No sources available. Are you sure that you are running core? and that the frontend makes the request to the correct url [port]?</div>
            )}

            {/* Carousels */}
            <MovieCarousel title="Similar Movies" items={similar} />
            <MovieCarousel title="Recommended for You" items={recommendations} />
        </div>
    )
}
