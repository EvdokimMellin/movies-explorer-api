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

app.use(requestLogger);

app.use(helmet());

app.use(router);

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT);
