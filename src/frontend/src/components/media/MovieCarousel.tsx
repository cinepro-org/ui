import type { MovieResultItem } from "@lorenzopant/tmdb"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel.tsx"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { LucidePlay, LucideStar } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { useNavigate } from "react-router-dom"

export default function MovieCarousel({ title, movies, loading }: { title: string; movies: MovieResultItem[], loading: boolean }) {
    return (
        <section className="my-8">
            <h2 className="mb-4 text-2xl font-bold">{title}</h2>

            <Carousel opts={{ skipSnaps: true, dragFree: true }} className="h-full w-full">
                <CarouselContent className="h-full w-full px-3">
                    {loading &&
                        Array.from({ length: 20 }).map((_, idx) => (
                            <CarouselItem key={idx} className={"h-full w-full p-2 md:basis-1/10 lg:basis-1/8"}>
                                <Skeleton className="h-40 w-28 rounded-2xl" />
                            </CarouselItem>
                        ))}
                    {!loading &&
                        movies.map((movie, idx) => (
                            <CarouselItem key={idx} className="h-full w-full p-2 md:basis-1/10 lg:basis-1/8">
                                <HoverCard openDelay={250} closeDelay={300}>
                                    <HoverCardTrigger>
                                        <MovieCardTrigger movie={movie} />
                                    </HoverCardTrigger>
                                    <HoverCardContent
                                        side="right"
                                        className="smoothie rings-1 rings-white/5 m-0 flex flex-col gap-2 overflow-hidden rounded-xl bg-black/80 p-0 ring-[1px] ring-slate-500/20 backdrop-blur select-none!"
                                    >
                                        <MovieCardContent movie={movie} />
                                    </HoverCardContent>
                                </HoverCard>
                            </CarouselItem>
                        ))}
                </CarouselContent>

                <CarouselPrevious style={{ marginLeft: "50px" }} />
                <CarouselNext style={{ marginRight: "50px" }} />
            </Carousel>
        </section>
    )
}

// Trigger component shows poster or skeleton
export function MovieCardTrigger({ movie }: { movie: MovieResultItem }) {
    const alt = movie.title || "No Title"
    return <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={alt} className="h-full w-full rounded-2xl object-cover" width={300} height={169} />
}

// HoverCard content component with skeleton fallback
export function MovieCardContent({ movie }: { movie: MovieResultItem }) {
    const backdrop = movie.backdrop_path
    const imgSrc = backdrop ? `https://image.tmdb.org/t/p/original${backdrop}` : null
    const title = movie.title || "No Title"
    const overviewFull = movie.overview
    const overview = overviewFull ? (overviewFull.length > 100 ? overviewFull.slice(0, 100) + "..." : overviewFull) : "No overview available."
    const rating = movie.vote_average ?? null
    const date = movie.release_date || "Unknown"
    const lang = movie.original_language?.toUpperCase() || "—"
    const id = movie.id

    const navigate = useNavigate()

    return (
        <div>
            {/* Image / Poster */}
            <div className="relative flex aspect-2/1 w-full overflow-hidden rounded-xl bg-white/5">
                {imgSrc ? <img src={imgSrc} alt={title} className="h-full w-full object-cover object-center select-none!" /> : <Skeleton className="h-full w-full" />}

                {/* Rating Badge */}
                {rating !== null && (
                    <span className="text-gold absolute top-1 right-1 flex items-center gap-1 rounded-md bg-black/75 p-1 text-xs">
                        <LucideStar size={13} />
                        {Number(rating).toFixed(1)}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 p-4 pt-2">
                <div className="flex flex-col items-start gap-1">
                    <span className="line-clamp-2! leading-tight! font-medium tracking-wider text-pretty">{title || <Skeleton className="h-4 w-24" />}</span>
                    <span className="line-clamp-3! text-xs leading-tight! text-gray-400">{overview || <Skeleton className="h-3 w-full" />}</span>
                </div>

                <div className="flex flex-col gap-[0.1rem] text-[.8rem]">
                    <div className="flex items-center gap-1">
                        <span className="tracking-wider! text-gray-400">Date:</span>
                        <span className="text-xs tracking-wider! text-gray-300">{date || <Skeleton className="h-3 w-12" />}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="tracking-wider! text-gray-400">Lang:</span>
                        <span className="text-xs tracking-wider! text-gray-300">{lang || <Skeleton className="h-3 w-6" />}</span>
                    </div>
                </div>

                <div className="mt-2 flex gap-x-2 text-sm font-medium">
                    <Button
                        variant="outline"
                        className="flex flex-grow items-center justify-center gap-2 overflow-hidden p-2 px-4 !select-none"
                        onClick={() => (navigate("/movie/" + id))}
                    >
                        <LucidePlay className="h-4 w-4" />
                        Watch Now!
                    </Button>
                </div>
            </div>
        </div>
    )
}
