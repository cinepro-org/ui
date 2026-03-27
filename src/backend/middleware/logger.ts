import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
}

function getStatusColor(statusCode: number): string {
    if (statusCode >= 500) return colors.red
    if (statusCode >= 400) return colors.yellow
    if (statusCode >= 300) return colors.blue
    if (statusCode >= 200) return colors.green
    return colors.reset
}

export function requestLogger(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    if (request.url.startsWith("/@") || request.url.startsWith("/src")) {
        return done()
    }

    const startTime = Date.now()

    reply.raw.on('finish', () => {
        const duration = Date.now() - startTime
        const timestamp = new Date().toISOString()
        const statusColor = getStatusColor(reply.statusCode)

        console.log(
            `${colors.gray}[${timestamp}]${colors.reset} ` + `${request.method} ${request.url} ` + `${statusColor}${reply.statusCode}${colors.reset} ` + `${colors.gray}- ${duration}ms${colors.reset}`
        )
    })

    done()
}