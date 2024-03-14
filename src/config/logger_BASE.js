import winston from "winston";

// LOGGER
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: "http" }),
        new winston.transports.File({ filename: './errors.log', level: 'warn' })
    ]
})

// MIDDLEWARE
export const addLogger = (req, res, next) => {
    req.logger = logger

    req.logger.warn(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    req.logger.debug(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)

    next();
}