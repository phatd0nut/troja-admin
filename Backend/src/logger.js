const winston = require('winston');
const path = require('path');

// Create a logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
const fs = require('fs');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}


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