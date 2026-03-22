import path from "path"
import { resolve } from 'node:path'
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import viteFastify from '@fastify/vite/plugin'

export default defineConfig({
    root: resolve(import.meta.dirname, 'src', 'frontend'),
    plugins: [viteFastify({ spa: true, useRelativePaths: true }), react(), tailwindcss()],
    resolve: {
        alias: {
            "@": resolve(import.meta.dirname, 'src', 'frontend', 'src'),
        },
    },
    build: {
    emptyOutDir: true,
    outDir: resolve(import.meta.dirname, 'build'),
  },
})
