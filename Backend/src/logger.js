const winston = require('winston');
const path = require('path');
const logsDir = path.join(__dirname, 'logs');
const fs = require('fs');
//skapar en loggfil om den inte redan finns
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

/**
 * skapar en logger
 */
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logsDir, 'combined.log') }),
        new winston.transports.Console()
    ],
});

module.exports = logger;