import MovieCarousel from "@/components/media/MovieCarousel"
import { useEffect, useState } from "react"
import type { MovieResultItem } from "@lorenzopant/tmdb"
import { useTmdb } from "@/components/providers/tmdb-provider"

export default function Movies() {
    const tmdb = useTmdb()

    // Movies
    const [popularMovies, setPopularMovies] = useState<MovieResultItem[]>([])
    const [topRatedMovies, setTopRatedMovies] = useState<MovieResultItem[]>([])
    const [genreMovies, setGenreMovies] = useState<Record<number, MovieResultItem[]>>({})
    const GENRES = [
        {
            id: 28,
            name: "Action",
        },
        {
            id: 12,
            name: "Adventure",
        },
        {
            id: 16,
            name: "Animation",
        },
        {
            id: 35,
            name: "Comedy",
        },
        {
            id: 80,
            name: "Crime",
        },
        {
            id: 18,
            name: "Drama",
        },
        {
            id: 10751,
            name: "Family",
        },
        {
            id: 14,
            name: "Fantasy",
        },
        {
            id: 36,
            name: "History",
        },
        {
            id: 27,
            name: "Horror",
        },
        {
            id: 9648,
            name: "Mystery",
        },
        {
            id: 10749,
            name: "Romance",
        },
        {
            id: 878,
            name: "Science Fiction",
        },
        {
            id: 10770,
            name: "TV Movie",
        },
        {
            id: 53,
            name: "Thriller",
        },
        {
            id: 10752,
            name: "War",
        },
        {
            id: 37,
            name: "Western",
        },
    ]
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)

                const [popularMoviesRes, topRatedMoviesRes, ...genreResults] = await Promise.all([
                    tmdb.movie_lists.popular({ language: "en-US" }),
                    tmdb.movie_lists.top_rated({ language: "en-US" }),

                    ...GENRES.map((g) =>
                        tmdb.discover.movie({
                            language: "en-US",
                            with_genres: String(g.id),
                            sort_by: "popularity.desc",
                        })
                    ),
                ])

                setPopularMovies(popularMoviesRes.results || [])
                setTopRatedMovies(topRatedMoviesRes.results || [])

                // map genre results back to IDs
                const genreMap: Record<number, MovieResultItem[]> = {}

                GENRES.forEach((g, i) => {
                    genreMap[g.id] = genreResults[i]?.results || []
                })

                setGenreMovies(genreMap)
            } catch (error) {
                console.error("Failed to fetch media:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [tmdb])

    return (
        <section className="space-y-8">
            <MovieCarousel loading={loading} title="Popular Movies" movies={popularMovies} />
            <MovieCarousel loading={loading} title="Top Rated Movies" movies={topRatedMovies} />

            {GENRES.map((genre) => (
                <MovieCarousel key={genre.id} loading={loading} title={`${genre.name} Movies`} movies={genreMovies[genre.id] || []} />
            ))}
        </section>
    )
}
