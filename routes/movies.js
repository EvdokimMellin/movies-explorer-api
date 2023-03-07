const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createMovie, getMovies, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', celebrate({
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
    movieId: Joi.string().hex().length(24).required(),
  }),
}), createMovie);
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

// router.use((req, res, next) => {
//   next(new NotFoundError('Такой страницы не существует'));
// });

module.exports = router;
