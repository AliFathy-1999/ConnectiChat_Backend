require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const helmet = require('helmet');
const { AppError } = require('./lib');
const handleResponseError = require('./lib/handlingErrors');

const app = express();

const cors = require('cors');

const routes = require('./routes/index.js');
require('./DB/connects');


const corsOptions = {
  origin :      'http://localhost:4200',
  credentials : true,
};
const logger = winston.createLogger({
  level :  'error',
  format : winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(morgan('dev'));
app.use(helmet());
app.use('/', routes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(handleResponseError);

module.exports = app;
