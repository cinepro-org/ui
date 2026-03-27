import Fastify from "fastify"
import fastifyVite from "@fastify/vite"
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import sensible from "@fastify/sensible"
import compress from "@fastify/compress"
import rateLimit from "@fastify/rate-limit"
import env from "@fastify/env"
import { resolve } from "node:path"
import { requestLogger } from "./middleware/logger.js"

const schema = {
  type: 'object',
  required: [ 'VITE_TMDB_API_KEY' ],
  properties: {
    VITE_TMDB_API_KEY: {
      type: 'string'
    },
  }
}

const options = {
  confKey: 'config', // optional, default: 'config'
    schema: schema,
    dotenv: true, // optional, default: true
}

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      VITE_TMDB_API_KEY: string
    };
  }
}


async function build() {
    const isDev = process.argv.includes("--dev")

    const app = Fastify({
        logger: false,
        trustProxy: true,
    })

    app.addHook('onRequest', requestLogger)

    await app.register(env, options)

await app.register(helmet, {
  contentSecurityPolicy: isDev ? false : {
        directives: {
          defaultSrc: ["'self'"],

          // API calls, fetch, websockets, HLS manifests
          connectSrc: [
            "'self'",
            "https://api.themoviedb.org",
          ],

          // Images (TMDB posters etc.)
          imgSrc: [
            "'self'",
            "data:",
            "https://image.tmdb.org",
          ],

          // JS (only your bundled app)
          scriptSrc: ["'self'"],

          // CSS (Tailwind / UI libs need inline)
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
          ],

          // Video / HLS streaming
          mediaSrc: [
            "'self'",
            "https:",
          ],

          // Fonts (safe default)
          fontSrc: [
            "'self'",
            "https:",
            "data:",
          ],

          // Security hardening
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'self'"],
        },
      },

  referrerPolicy: {
    policy: ["origin"],
  },
})

    await app.register(cors, {
        origin: isDev ? true : process.env.BACKEND_CORS_ORIGIN,
        credentials: true,
    })

    await app.register(sensible)

    await app.register(compress, {
        global: true,
    })

    await app.register(rateLimit, {
        max: 100,
        timeWindow: "1 minute",
    })

    await app.register(fastifyVite, {
        root: resolve(import.meta.dirname, "..", ".."),
        distDir: resolve(import.meta.dirname, "..", "..", "build"),
        dev: isDev,
        spa: true,
    })

    app.register(async function (api) {
        api.get("/api/*", async () => {
            return { message: "Reserved for later use." }
        })
    })

    app.get("*", (_, reply) => {
        return reply.html()
    })

    await app.vite.ready()

    return app
}

build().then(async (app) => {
    try {
        await app.listen({
            port: 8082,
            host: "0.0.0.0",
        })

        // @ts-ignore
        console.log(`Server running at http://localhost:${app.server.address().port}`)

        app.log.info(`Server running`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
})
