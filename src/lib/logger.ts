import winston from 'winston'

const consoleFormat = winston.format.combine(
    winston.format.colorize({
        all: true,
    }),
    winston.format.timestamp({
        format: 'DD-MM-YY HH:mm:ss',
    }),
    winston.format.printf(
        (options) =>
            `${options.timestamp} - [${options.moduleName}] ${options.level}: ${options.message}`
    )
)

export const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: consoleFormat,
        })
    )
}
