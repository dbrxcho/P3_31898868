const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.json(),
  transports: [
    new transports.Console({ format: format.combine(format.timestamp(), format.json()) })
  ]
});

module.exports = logger;