// components/movie/MovieDetails.tsx
import type { MovieDetailsWithAppends } from "@lorenzopant/tmdb"
import type { Diagnostic } from "@omss/sdk"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Info, XCircle } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type MovieFull = MovieDetailsWithAppends<["credits", "videos", "images", "release_dates", "similar", "recommendations"]>

interface MovieDetailsProps {
    movie: MovieFull | null
    loading: boolean
    diagnostics?: Diagnostic[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TMDB_IMG = (path: string | null, size = "w342") => (path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png")

function ratingColor(avg: number) {
    if (avg >= 7.5) return "text-green-500"
    if (avg >= 5.5) return "text-yellow-500"
    return "text-red-500"
}

// Find US certification from release_dates append
function getUsCertification(movie: MovieFull): string | null {
    const usEntry = movie.release_dates.results.find((r) => r.iso_3166_1 === "US")
    if (!usEntry) return null
    return usEntry.release_dates.find((d) => d.certification)?.certification ?? null
}

// ─── Skeleton state ───────────────────────────────────────────────────────────

function DetailsSkeleton() {
    return (
        <div className="flex w-full shrink-0 flex-col gap-4 md:w-80 lg:w-96">
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            <Skeleton className="h-6 w-2/3 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-4/6 rounded" />
        </div>
    )
}

// ─── Diagnostic pill ─────────────────────────────────────────────────────────

const DiagnosticIcon = ({ severity }: { severity: Diagnostic["severity"] }) => {
    if (severity === "error") return <XCircle className="h-3.5 w-3.5 text-red-500" />
    if (severity === "warning") return <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
    return <Info className="h-3.5 w-3.5 text-blue-400" />
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function MovieDetails({ movie, loading, diagnostics = [] }: MovieDetailsProps) {
    if (loading || !movie) return <DetailsSkeleton />

    const director = movie.credits.crew.find((c) => c.job === "Director")
    const topCast = movie.credits.cast.slice(0, 6)
    const certification = getUsCertification(movie)

    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "—"

    return (
        <aside className="flex w-full shrink-0 flex-col gap-5 md:w-80 lg:w-96">
            {/* Poster */}
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
                <img src={TMDB_IMG(movie.poster_path, "w500")} alt={movie.title} className="w-full object-cover transition-transform duration-500 hover:scale-105" />
                {certification && (
                    <Badge variant="secondary" className="absolute top-3 right-3 text-xs font-bold">
                        {certification}
                    </Badge>
                )}
            </div>

            {/* Info card */}
            <Card className="shadow-md">
                <CardHeader className="px-4 pt-4 pb-2">
                    <h2 className="text-xl leading-tight font-bold">{movie.title}</h2>
                    {movie.tagline && <p className="text-sm text-muted-foreground italic">"{movie.tagline}"</p>}
                </CardHeader>

                <CardContent className="flex flex-col gap-4 px-4 pb-4">
                    {/* Rating bar */}
                    <div className="flex items-center gap-3">
                        <span className={`text-3xl font-extrabold tabular-nums ${ratingColor(movie.vote_average)}`}>{movie.vote_average.toFixed(1)}</span>
                        <div className="flex flex-col text-xs text-muted-foreground">
                            <span>/ 10</span>
                            <span>{movie.vote_count.toLocaleString()} votes</span>
                        </div>
                        <div className="ml-auto flex flex-col items-end text-xs text-muted-foreground">
                            <span>{movie.release_date.slice(0, 4)}</span>
                            <span>{runtime}</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Genres */}
                    <div className="flex flex-wrap gap-1.5">
                        {movie.genres.map((g) => (
                            <Badge key={g.id} variant="outline" className="text-xs">
                                {g.name}
                            </Badge>
                        ))}
                    </div>

                    <Separator />

                    {/* Meta grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Director</p>
                            <p>{director?.name ?? "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Language</p>
                            <p className="uppercase">{movie.original_language}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Status</p>
                            <p>{movie.status}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Budget</p>
                            <p>{movie.budget ? `$${(movie.budget / 1_000_000).toFixed(0)}M` : "—"}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Overview */}
                    <div>
                        <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Overview</p>
                        <ScrollArea className="h-28">
                            <p className="pr-2 text-sm leading-relaxed text-foreground/80">{movie.overview ?? "No overview available."}</p>
                        </ScrollArea>
                    </div>

                    <Separator />

                    {/* Cast */}
                    {topCast.length > 0 && (
                        <div>
                            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Cast</p>
                            <div className="flex flex-wrap gap-2">
                                {topCast.map((actor) => (
                                    <TooltipProvider key={actor.id} delayDuration={200}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <img
                                                    src={TMDB_IMG(actor.profile_path, "w92")}
                                                    alt={actor.name}
                                                    className="h-10 w-10 cursor-default rounded-full border border-border object-cover shadow-sm"
                                                    loading="lazy"
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom" className="text-xs">
                                                <p className="font-semibold">{actor.name}</p>
                                                <p className="text-muted-foreground">{actor.character}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* OMSS Diagnostics */}
                    {diagnostics.length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Source Diagnostics</p>
                                <div className="flex flex-col gap-1">
                                    {diagnostics.map((d, i) => (
                                        <div key={i} className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-2 py-1.5 text-xs">
                                            <DiagnosticIcon severity={d.severity} />
                                            <span className="leading-snug text-muted-foreground">{d.message}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </aside>
    )
}
