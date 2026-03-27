/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react"
import { createOmssClient, OmssClient } from "@omss/sdk"

const OmssContext = createContext<OmssClient | null>(null)

export function OmssProvider({ children }: { children: React.ReactNode }) {
    const client = createOmssClient({
        baseUrl: import.meta.env.VITE_OMSS_API_URL || "http://localhost:3000",
    })

    return <OmssContext.Provider value={client}>{children}</OmssContext.Provider>
}

export function useOmss() {
    const ctx = useContext(OmssContext)
    if (!ctx) throw new Error("OmssProvider missing")
    return ctx
}
