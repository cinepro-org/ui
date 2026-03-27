import { useEffect, useState } from "react"
import type { TVSeriesResultItem } from "@lorenzopant/tmdb"
import { useTmdb } from "@/components/providers/tmdb-provider"
import TVCarousel from "@/components/media/TvCarousel.tsx"

export default function Shows() {
    const tmdb = useTmdb()

    // TV Shows
    const [popularShows, setPopularShows] = useState<TVSeriesResultItem[]>([])
    const [topRatedShows, setTopRatedShows] = useState<TVSeriesResultItem[]>([])

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)

                const [popularShows, topRatedShows] = await Promise.all([tmdb.tv_lists.popular({ language: "en-US" }), tmdb.tv_lists.top_rated({ language: "en-US" })])

                // TV
                setPopularShows(popularShows.results || [])
                setTopRatedShows(topRatedShows.results || [])
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
            <TVCarousel loading={loading} title="Popular TV Shows" shows={popularShows} />
            <TVCarousel loading={loading} title="Top Rated TV Shows" shows={topRatedShows} />
        </section>
    )
}
