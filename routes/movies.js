const router = require('express').Router();
const {
  createMovie, getMovies, deleteMovie,
} = require('../controllers/movies');
const { createMovieValidator, deleteMovieValidator } = require('../utils/validators');
const NotFoundError = require('../errors/NotFoundError');

router.get('/', getMovies);
// router.post('/', createMovieValidator, createMovie);
router.post('/', createMovie);
router.delete('/:movieId', deleteMovieValidator, deleteMovie);

router.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
