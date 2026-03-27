/// <reference types="vite/client" />

interface ImportMetaEnv {
    /// A boolean flag indicating whether the app is a standalone (i.e. SPA/no backend)
    readonly VITE_STANDALONE: string
    /// The API key for TMDB API
    readonly VITE_TMDB_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
