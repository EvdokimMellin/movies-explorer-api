require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');

const app = express();

const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser, signOut } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000, DATA_BASE = 'mongodb://localhost:27017/movies-explorer-db' } = process.env;

mongoose.connect(DATA_BASE);

app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);
app.post('/signout', signOut);

app.use(requestLogger);

app.use(auth);

app.use('/', userRouter);
app.use('/', movieRouter);

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT);
