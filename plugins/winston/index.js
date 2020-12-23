const winston = require('winston');
const ElasticSearch = require('winston-elasticsearch');
require('dotenv').config();

// winston-elasticsearch options
const options = {
  console: {
    level: 'info',
    handleExceptions: true,
    json: true,
    colorize: true,
  },
  elasticsearch: {
    level: 'info',
    index: process.env.ELASTIC_INDEX || 'default-',
    clientOpts: {
      host: process.env.ELASTIC_HOST || '',
      maxRetries: 3,
      requestTimeout: 10000,
      sniffOnStart: false,
    },
    transformer: (logData) => ({
      '@timestamp': new Date().toISOString(),
      severity: logData.level,
      message: `[${logData.level}] LOG Message: ${logData.message}`,
      fields: logData.meta || {},
    }),
  },
};


// winston logger
const logger = winston.createLogger({
  exitOnError: false,
  level: 'info',
  format: winston.format.json(),
});

if (process.env.ELASTIC_START === 'true') {
  // winston-elasticsearch transport
  const ElasticSearchTransport = new ElasticSearch(options.elasticsearch);

  logger.add(ElasticSearchTransport);
} else {
  logger.add(new winston.transports.Console(options.console));
}

module.exports = logger;
