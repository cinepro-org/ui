import Fastify from "fastify"
import fastifyVite from "@fastify/vite"
import {resolve} from "node:path"

async function build() {
    const app = Fastify()

    await app.register(fastifyVite, {
        root: resolve(import.meta.dirname, "..", ".."),
        distDir: resolve(import.meta.dirname, '..', '..', 'build'),
        dev: process.argv.includes('--dev'),
        spa: true
    })

    // Example API route
    app.get("/api/health", async () => {
        return { status: "ok" }
    })

    app.get('*', (_, reply) => {
        return reply.html()
    })

    await app.vite.ready()
    return app
}

build().then((app) => {
    app.listen({ port: 8082 }, (err) => {
        if (err) {
            app.log.error(err)
            process.exit(1)
        }
    })
})
