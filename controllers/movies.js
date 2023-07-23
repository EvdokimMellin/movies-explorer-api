const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

function getMovies(req, res, next) {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
}

function createMovie(req, res, next) {
  const request = req.body;
  res.send(request);
  // request.owner = req.user._id;

  // Movie.create(request)
  //   .then((movie) => res.status(200).send(movie))
  //   .catch(next);
}

function deleteMovie(req, res, next) {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        return Promise.reject(new NotFoundError('Такой фильм не найден'));
      }
      if (movie.owner.toString() !== req.user._id) {
        return Promise.reject(new ForbiddenError('Вы не можете удалить этот фильм'));
      }
      return movie;
    })
    .then(() => Movie.findByIdAndRemove(req.params.movieId))
    .then((movie) => {
      if (!movie) {
        return Promise.reject(new NotFoundError('Такой фильм не найден'));
      }
      return res.status(200).send({ message: 'Фильм удален' });
    })
    .catch(next);
}

module.exports = {
  createMovie, deleteMovie, getMovies,
};
