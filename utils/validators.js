const { Joi, celebrate } = require('celebrate');

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const createUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const updateProfileValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(/https?:\/\/[\S]+/).required(),
    trailerLink: Joi.string().pattern(/https?:\/\/[\S]+/).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().pattern(/https?:\/\/[\S]+/).required(),
    movieId: Joi.number().required(),
  }),
});

const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  loginValidator,
  createUserValidator,
  updateProfileValidator,
  createMovieValidator,
  deleteMovieValidator,
};
