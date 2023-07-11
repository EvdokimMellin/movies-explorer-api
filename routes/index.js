const router = require('express').Router();
const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');

const userRouter = require('./users');
const movieRouter = require('./movies');

const { loginValidator, createUserValidator } = require('../utils/validators');
const { createUser, login, signOut } = require('../controllers/users');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.post('/signout', signOut);

router.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
