const winston = require("winston");

// Define the log levels and formatting
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
  )
);

// Create a winston logger instance
const logger = winston.createLogger({
  level: "info", // Default log level
  format: logFormat,
  transports: [
    // Log to the console with colorized output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // Log to a file (logs will be saved in 'logs' directory)
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error", // Only log errors to this file
    }),
    new winston.transports.File({
      filename: "logs/combined.log", // Log all levels to this file
    }),
  ],
});

// If the app is running in a development environment, log to the console
if (process.env.NODE_ENV === "development") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = logger;
