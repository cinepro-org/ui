declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production"
            BACKEND_CORS_ORIGIN: string
        }
    }
}

export {}
