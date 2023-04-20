import ApiError from '../classes/api-error.class.js';
import tokensService from '../tokens/tokens.service.js';
import environment from './../environments/environment.js';
import jsonwebtoken from 'jsonwebtoken';

const roleMiddleware = (roles) => {
  return (request, response, next) => {
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

      let hasRole = false;

      userData.roles.forEach((role) => {
        if (roles.includes(role)) hasRole = true;
      });

      if (!hasRole) {
        next(
          ApiError.BadRequestError(
            'The user does not have access to the function'
          )
        );

        return;
      }

      next();
    } catch (error) {}
  };
};

export default roleMiddleware;
