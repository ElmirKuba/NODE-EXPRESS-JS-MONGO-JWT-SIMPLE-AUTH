import Router from 'express';

import authMiddleware from '../auth/auth.middleware.js';
import roleMiddleware from '../roles/role.middleware.js';

import userService from './user.service.js';

const router = new Router();

router.get(
  '/users',
  [authMiddleware, roleMiddleware(['admin'])],
  async (request, response) => {
    try {
      const users = await userService.getAllUsers();

      response.status(200).json(users);
    } catch (error) {}
  }
);

export default router;
