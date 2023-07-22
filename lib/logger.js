const winston = require('winston');

const customFormat = () => {
    const createdAt = new Date();
    const formattedCreatedAt = createdAt.toLocaleString();
    return formattedCreatedAt;
  }
const logger = winston.createLogger({
  level : 'error',
  format : winston.format.combine(
    winston.format.timestamp({format : customFormat()}),
    winston.format.json({ space : 2 }),
  ),
  transports : [
    new winston.transports.File({ filename : './app.log' }) 
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format : winston.format.simple(),
}));
}

module.exports = logger;