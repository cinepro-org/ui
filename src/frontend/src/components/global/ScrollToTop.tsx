import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        if (!pathname.startsWith("/movie") && !pathname.startsWith("/tv")) return
        window.scrollTo({
            top: 0,
            behavior: "instant",
        })
    }, [pathname])

    return null
}
