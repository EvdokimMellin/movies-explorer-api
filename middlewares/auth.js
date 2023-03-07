const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

function auth(req, res, next) {
  const { cookie } = req.headers;

  let JWT_SECRET;

  if (process.env.NODE_ENV !== 'production') {
    JWT_SECRET = 'dev-key';
  } else {
    JWT_SECRET = process.env.JWT_SECRET;
  }

  if (!cookie || !cookie.startsWith('jwt=')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = cookie.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
}

module.exports = auth;
