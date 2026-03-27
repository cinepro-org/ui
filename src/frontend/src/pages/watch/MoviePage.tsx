// pages/MoviePage.tsx
import { useParams } from "react-router-dom"
import { useTmdb } from "@/components/providers/tmdb-provider.tsx"
import { useOmss } from "@/components/providers/omss-provider.tsx"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { MovieDetailsWithAppends } from "@lorenzopant/tmdb"
import type { Source, Subtitle, Diagnostic } from "@omss/sdk"
import { MovieMain } from "@/pages/watch/MovieMain"
import { MovieDetails } from "@/pages/watch/MovieDetails"
import type { MovieResultItem } from "@lorenzopant/tmdb"

type MovieFull = MovieDetailsWithAppends<["credits", "videos", "images", "release_dates", "similar", "recommendations"]>

export default function MoviePage() {
    const { id } = useParams<{ id: string }>()
    const tmdb = useTmdb()
    const omss = useOmss()

    const [movie, setMovie] = useState<MovieFull | null>(null)
    const [movieLoading, setMovieLoading] = useState(true)

    const [sources, setSources] = useState<Source[]>([])
    const [subtitles, setSubtitles] = useState<Subtitle[]>([])
    const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
    const [sourcesLoading, setSourcesLoading] = useState(true)

    // Fetch TMDB details
    useEffect(() => {
        if (!id) return
        setMovieLoading(true)
        tmdb.movies
            .details({
                movie_id: parseInt(id),
                language: "en-US",
                append_to_response: ["videos", "images", "credits", "release_dates", "similar", "recommendations"],
            })
            .then(setMovie)
            .catch((err) =>
                toast.error("Failed to load movie details.", {
                    description: err instanceof Error ? err.message : String(err),
                })
            )
            .finally(() => setMovieLoading(false))
    }, [id, tmdb])

    // Fetch OMSS streaming sources
    useEffect(() => {
        if (!id) return
        setSourcesLoading(true)
        omss.getMovie(id)
            .then(({ data, error }) => {
                if (error || !data) return
                setSources(data.sources)
                setSubtitles(data.subtitles ?? [])
                setDiagnostics(data.diagnostics ?? [])
            })
            .catch(console.error)
            .finally(() => setSourcesLoading(false))
    }, [id, omss])

    const similar = (movie?.similar?.results ?? []) as MovieResultItem[]
    const recommendations = (movie?.recommendations?.results ?? []) as MovieResultItem[]

    return (
        <div className="flex min-h-screen flex-col gap-6 p-4 md:flex-row md:items-start md:p-8 lg:gap-10">
            {/* Left – player + carousels */}
            <MovieMain sources={sources} subtitles={subtitles} similar={similar} recommendations={recommendations} sourcesLoading={sourcesLoading} />

            {/* Right – poster + metadata */}
            <MovieDetails movie={movie} loading={movieLoading} diagnostics={diagnostics} />
        </div>
    )
}
