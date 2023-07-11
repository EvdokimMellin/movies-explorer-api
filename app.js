require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');

const app = express();

const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000, DATA_BASE = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

mongoose.connect(DATA_BASE);

app.use(bodyParser.json());

const allowedCors = [
  'http://localhost:3000',
  'http://movies-explorer-em.nomoredomains.work',
  'https://movies-explorer-em.nomoredomains.work',
];

app.use((req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
  }

  next();
});

app.use(requestLogger);

// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use('/', router);

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT);
