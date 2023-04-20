import jsonwebtoken from 'jsonwebtoken';

import environment from './../environments/environment.js';
import ApiError from '../classes/api-error.class.js';
import tokensService from '../tokens/tokens.service.js';

const authMiddleware = (request, response, next) => {
  if (request.method === 'OPTIONS') next();

  try {
    const authorizationHeader = request.headers.authorization.split(' ');

    if (!authorizationHeader) {
      next(ApiError.UnauthorizedError());

      return;
    }

    const authMethod = authorizationHeader[0];

    if (authMethod !== 'Bearer') {
      next(
        ApiError.BadRequestError(
          'Поддерживается авторизация только по Bearer JWT токену'
        )
      );

      return;
    }

    const accessToken = authorizationHeader[1];

    if (!accessToken) {
      next(ApiError.UnauthorizedError());

      return;
    }

    const userData = tokensService.validateAccessToken(accessToken);

    if (!userData) {
      next(ApiError.UnauthorizedError());

      return;
    }

    request.userData = userData;

    next();
  } catch (error) {
    next(ApiError.UnauthorizedError());

    return;
  }
};

export default authMiddleware;
