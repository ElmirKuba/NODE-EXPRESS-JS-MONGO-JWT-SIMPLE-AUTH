import Router from 'express';
import { check, validationResult } from 'express-validator';

import authService from './auth.service.js';

const MIN_LENGTH_PASSWORD = 3;
const MAX_LENGTH_PASSWORD = 30;

const router = new Router();

import ApiError from '../classes/api-error.class.js';

router.post(
  '/auth/register',
  [
    check('username', 'Username must not be empty').notEmpty(),
    check(
      'password',
      `Password must be between ${MIN_LENGTH_PASSWORD} and ${MAX_LENGTH_PASSWORD} characters (inclusive)`
    ).isLength({
      min: MIN_LENGTH_PASSWORD,
      max: MAX_LENGTH_PASSWORD,
    }),
  ],
  async (request, response, next) => {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        next(
          ApiError.BadRequestError('Ошибка при регистрации', errors.array())
        );
        return;
      }

      const { username, password } = request.body;

      const userData = await authService.register(username, password);

      response.cookie('refreshToken', userData.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      response.status(201).json(userData);

      return;
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/auth/login',
  [
    check('username', 'Username must not be empty').notEmpty(),
    check(
      'password',
      `Password must be between ${MIN_LENGTH_PASSWORD} and ${MAX_LENGTH_PASSWORD} characters (inclusive)`
    ).isLength({
      min: MIN_LENGTH_PASSWORD,
      max: MAX_LENGTH_PASSWORD,
    }),
  ],
  async (request, response, next) => {
    try {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        next(
          ApiError.BadRequestError('Ошибка при авторизации', errors.array())
        );
        return;
      }

      const { username, password } = request.body;

      const userData = await authService.login(username, password);

      response.cookie('refreshToken', userData.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      response.status(201).json(userData);

      return;
    } catch (error) {
      next(error);
    }
  }
);

router.post('/auth/logout', async (request, response, next) => {
  try {
    const { refreshToken } = request.cookies;

    const logoutData = await authService.logout(refreshToken);

    response.clearCookie('refreshToken');

    response.status(200).json(logoutData);

    return;
  } catch (error) {
    next(error);
  }
});

router.get('/auth/refresh-tokens', async (request, response, next) => {
  try {
    const { refreshToken } = request.cookies;

    const userData = await authService.refreshTokens(refreshToken);

    response.cookie('refreshToken', userData.tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    response.status(201).json(userData);

    return;
  } catch (error) {
    next(error);
  }
});

export default router;
