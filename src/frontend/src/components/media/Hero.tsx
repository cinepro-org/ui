import { useEffect, useState } from "react"
import Autoplay from "embla-carousel-autoplay"
import { LucidePlay, LucideStar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useTmdb } from "@/components/providers/tmdb-provider"
import { toast } from "sonner"
import type { TrendingMovieResult } from "@lorenzopant/tmdb"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom"

export function Hero() {
    const tmdb = useTmdb()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [movies, setMovies] = useState<TrendingMovieResult[]>([])
    const [logos, setLogos] = useState<(string | null)[]>([])

    // Fetch trending movies
    useEffect(() => {
        const load = async () => {
            try {
                const response = await tmdb.trending.movies({ time_window: "week" })
                setMovies(response.results)
            } catch (error) {
                toast.error("Failed to load popular movies. Please try again later.", {
                    description: error instanceof Error ? error.message : error ? String(error) : "Unknown error",
                    duration: 5000,
                })
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [tmdb])

    // Fetch logos for each movie
    useEffect(() => {
        if (!movies.length) return

        let cancelled = false

        const loadLogos = async () => {
            try {
                const results = await Promise.all(
                    movies.filter((m) => m.backdrop_path && m.poster_path && !m.adult && new Date(m.release_date) <= new Date()).map(async (movie) => {
                        try {
                            const res = await tmdb.movies.images({
                                movie_id: movie.id,
                                language: "en-US",
                                include_image_language: "en",
                            })
                            return res.logos?.[0]?.file_path ? `https://image.tmdb.org/t/p/w300${res.logos[0].file_path}` : null
                        } catch {
                            return null
                        }
                    })
                )
                if (!cancelled) setLogos(results)
            } catch {
                // ignore
            }
        }

        loadLogos()

        return () => {
            cancelled = true
        }
    }, [movies, tmdb])

    // Loading skeleton
    if (loading) {
        return (
            <div className="relative mt-3 h-[70vh] w-full overflow-hidden rounded-2xl bg-muted/50">
                <div className="flex h-full items-center justify-center">
                    <div className="flex w-full max-w-6xl items-center justify-between gap-10 px-10">
                        {/* Left content skeleton */}
                        <div className="flex max-w-xl flex-col gap-4">
                            <Skeleton className="h-12 w-48" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-32" />
                            <div className="mt-4 space-y-2">
                                <Skeleton className="h-4 w-96" />
                                <Skeleton className="h-4 w-80" />
                                <Skeleton className="h-4 w-72" />
                            </div>
                            <Skeleton className="mt-6 h-10 w-32" />
                        </div>
                        {/* Poster skeleton */}
                        <Skeleton className="h-100 w-65 rotate-6 rounded-lg" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-3 opacity-100 transition-opacity duration-500">
            <Carousel
                opts={{ loop: true }}
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
                className="h-full"
            >
                <CarouselContent className="h-full">
                    {movies
                        .filter((m) => m.backdrop_path && m.poster_path && !m.adult && new Date(m.release_date) <= new Date())
                        .map((movie, index) => {
                            const logoPath = logos[index]

                            return (
                                <CarouselItem key={movie.id} className="h-[70vh] w-full">
                                    <div
                                        className="relative flex h-full items-center justify-center rounded-2xl bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                                        }}
                                    >
                                        {/* overlay */}
                                        <div className="absolute inset-0 rounded-2xl bg-black/50 backdrop-blur-sm" />

                                        {/* content */}
                                        <div className="relative z-10 flex w-[93%] max-w-6xl items-center gap-12 px-10 text-white">
                                            <div className="max-w-xl space-y-4">
                                                {/* Logo or fallback title */}
                                                {logoPath ? (
                                                    <img src={logoPath} alt={`${movie.title} logo`} className="mb-4 max-h-[120px] w-auto object-contain" />
                                                ) : (
                                                    <h1 className="mb-4 text-4xl font-bold">{movie.title}</h1>
                                                )}


                                                <p className="line-clamp-4 text-sm text-white/90">{movie.overview}</p>

                                                <div className="mb-3 flex items-center gap-4 text-sm text-white/90">
                                                    <span>{movie.release_date ? new Date(movie.release_date).toLocaleDateString() : "Unknown"}</span>
                                                    <div className="flex items-center gap-1 text-yellow-400">
                                                        <LucideStar />
                                                        {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    className="bg-white/70 backdrop-blur-sm"
                                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                                >
                                                    <LucidePlay className="mr-2 h-4 w-4" />
                                                    Watch
                                                </Button>
                                            </div>

                                            {/* Poster */}
                                            <img
                                                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                                                alt={movie.title}
                                                className="h-100 rotate-6 transform-gpu rounded-lg shadow-lg transition-transform duration-500 ease-out hover:scale-105 hover:rotate-2"
                                            />
                                        </div>
                                    </div>
                                </CarouselItem>
                            )
                        })}
                </CarouselContent>

                <CarouselPrevious className="left-4 bg-black/40 text-white hover:bg-black/60" />
                <CarouselNext className="right-4 bg-black/40 text-white hover:bg-black/60" />
            </Carousel>
        </div>
    )
}
