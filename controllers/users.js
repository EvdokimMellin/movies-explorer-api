const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Такого пользователя не существует'));
      }
      return res.status(200).send(user);
    })
    .catch(next);
}

function updateProfile(req, res, next) {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Такого пользователя не существует'));
      }
      return res.status(200).send(user);
    })
    .catch(next);
}

function createUser(req, res, next) {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(200).send({
      name: user.name, about: user.about, avatar: user.avatar, email,
    }))
    .catch(next);
}

function login(req, res, next) {
  let enteringUser;

  User.findOne({ email: req.body.email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      enteringUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      let JWT_SECRET;

      if (process.env.NODE_ENV !== 'production') {
        JWT_SECRET = 'dev-key';
      } else {
        JWT_SECRET = process.env.JWT_SECRET;
      }

      const token = jwt.sign({ _id: enteringUser._id }, JWT_SECRET, { expiresIn: '7d' });

      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      }).status(200).send({ token });
    })
    .catch(next);
}

function signOut(req, res, next) {
  res.clearCookie('jwt').status(200).send({ message: 'Вы вышли' })
    .catch(next);
}

module.exports = {
  getCurrentUser, updateProfile, createUser, login, signOut,
};
