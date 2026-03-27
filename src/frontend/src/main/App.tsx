import { Toaster } from "@/components/ui/sonner"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "@/pages/home/Home"
import NotFound from "@/pages/404/NotFound"
import { SidebarInset } from "@/components/ui/sidebar"
import SideBar from "@/components/sidebar/SideBar"
import Footer from "@/components/global/Footer.tsx"
import Header from "@/components/global/Header.tsx"
import ScrollToTop from "@/components/global/ScrollToTop.tsx"
import Movies from "@/pages/movies/Movies.tsx"
import Shows from "@/pages/shows/Shows.tsx"
import MoviePage from "@/pages/watch/MoviePage.tsx"

export function App() {
    return (
        <BrowserRouter>
            <div className="flex min-h-screen w-full bg-sidebar text-foreground">
                {/* Sidebar */}
                <SideBar />

                {/* Content */}
                <SidebarInset className={"relative m-2 flex w-full flex-col overflow-hidden"}>
                    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-full animate-pulse" style={{ animationDuration: "20s" }}>
                            <div className="absolute -top-48 -left-48 h-[40vw] max-h-150 min-h-75 w-[40vw] max-w-150 min-w-75 rounded-full bg-primary/60 blur-[128px]" />
                            <div className="absolute -top-32 -left-32 h-[30vw] max-h-100 min-h-50 w-[30vw] max-w-100 min-w-50 rounded-full bg-primary/20 blur-[96px]" />
                            <div className="absolute -top-16 -left-16 h-[20vw] max-h-50 min-h-25 w-[20vw] max-w-50 min-w-25 rounded-full bg-primary/10 blur-3xl" />
                        </div>

                        <div className="absolute right-0 bottom-0 h-full w-full animate-pulse" style={{ animationDuration: "25s" }}>
                            <div className="absolute -right-48 -bottom-48 h-[40vw] max-h-150 min-h-75 w-[40vw] max-w-150 min-w-75 rounded-full bg-primary/60 blur-[128px]" />
                            <div className="absolute -right-32 -bottom-32 h-[30vw] max-h-100 min-h-50 w-[30vw] max-w-100 min-w-50 rounded-full bg-primary/20 blur-[96px]" />
                            <div className="absolute -right-16 -bottom-16 h-[20vw] max-h-50 min-h-25 w-[20vw] max-w-50 min-w-25 rounded-full bg-primary/10 blur-3xl" />
                        </div>
                    </div>

                    {/* Foreground content */}
                    <div className="relative z-10 flex w-full flex-1 flex-col">
                        {/* Header */}
                        <Header />

                        {/* Main content */}
                        <main
                            className="h-full w-full flex-1 rounded-md px-3 py-2.5 shadow-inner"
                            style={{
                                minHeight: "50vh",
                                maxWidth: "93vw",
                            }}
                        >
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/movies" element={<Movies />} />
                                <Route path="/shows" element={<Shows />} />
                                <Route path="/movie/:id" element={<MoviePage />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                        {/* Footer */}
                        <Footer />

                        {/* Utils */}
                        <Toaster />
                        <ScrollToTop />
                    </div>
                </SidebarInset>
            </div>
        </BrowserRouter>
    )
}

export default App
