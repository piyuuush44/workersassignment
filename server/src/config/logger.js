const winston = require('winston');

const level = process.env.LOG_LEVEL || 'debug';

const loggerFormats = [winston.format.simple(), winston.format.timestamp()];

if (process.env.NODE_ENV !== 'local') {
  loggerFormats.push(winston.format.json());
}

let logger;
if (process.env.NODE_ENV === 'test') {
  logger = winston.createLogger({
    silent: true,
    name: 'console',
    transports: [new winston.transports.Console()],
    level,
    defaultMeta: {service: 'api-service'},
    format: winston.format.combine(...loggerFormats),
  });
} else {
  logger = winston.createLogger({
    name: 'console',
    transports: [new winston.transports.Console()],
    level,
    defaultMeta: {service: 'api-service'},
    format: winston.format.combine(...loggerFormats),
  });
}

global.logger = logger;
module.exports = logger;
