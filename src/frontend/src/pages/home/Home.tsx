import { Hero } from "@/components/media/Hero.tsx"
import MovieCarousel from "@/components/media/MovieCarousel"
import TVCarousel from "@/components/media/TvCarousel.tsx"
import { useEffect, useState } from "react"
import type { MovieResultItem, TVSeriesResultItem } from "@lorenzopant/tmdb"
import { useTmdb } from "@/components/providers/tmdb-provider"

export default function Home() {
    const tmdb = useTmdb()

    // Movies
    const [popularMovies, setPopularMovies] = useState<MovieResultItem[]>([])
    const [topRatedMovies, setTopRatedMovies] = useState<MovieResultItem[]>([])

    // TV Shows
    const [popularShows, setPopularShows] = useState<TVSeriesResultItem[]>([])
    const [topRatedShows, setTopRatedShows] = useState<TVSeriesResultItem[]>([])

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)

                const [popularMoviesRes, topRatedMoviesRes, popularTVRes, topRatedTVRes] = await Promise.all([
                    tmdb.movie_lists.popular({ language: "en-US" }),
                    tmdb.movie_lists.top_rated({ language: "en-US" }),
                    tmdb.tv_lists.popular({ language: "en-US" }),
                    tmdb.tv_lists.top_rated({ language: "en-US" }),
                ])

                // Movies
                setPopularMovies(popularMoviesRes.results || [])
                setTopRatedMovies(topRatedMoviesRes.results || [])

                // TV
                setPopularShows(popularTVRes.results || [])
                setTopRatedShows(topRatedTVRes.results || [])
            } catch (error) {
                console.error("Failed to fetch media:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [tmdb])

    return (
        <section className="space-y-6">
            <Hero />

            <MovieCarousel loading={loading} title="Popular Movies" movies={popularMovies} />
            <MovieCarousel loading={loading} title="Top Rated Movies" movies={topRatedMovies} />

            <TVCarousel loading={loading} title="Popular TV Shows" shows={popularShows} />
            <TVCarousel loading={loading} title="Top Rated TV Shows" shows={topRatedShows} />
        </section>
    )
}
