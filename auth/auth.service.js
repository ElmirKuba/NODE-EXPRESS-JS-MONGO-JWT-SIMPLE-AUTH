import bcryptjs from 'bcryptjs';

import User from './../users/user.model.js';
import Role from './../roles/role.model.js';

import tokensService from './../tokens/tokens.service.js';

import UserDto from './../users/user.dto.js';

import ApiError from './../classes/api-error.class.js';

const authService = {
  async register(username, password) {
    const candidate = await User.findOne({ username });

    if (candidate) {
      throw ApiError.BadRequestError(
        'A user with that username already exists'
      );
    }

    const userRole = await Role.findOne({ value: 'user' });

    const hashPassword = bcryptjs.hashSync(password, 7);

    const user = await User({
      username,
      password: hashPassword,
      roles: [userRole.value],
    });

    await user.save();

    const userDto = new UserDto(user);

    const tokens = tokensService.generateNewPairTokens({ ...userDto });

    await tokensService.saveRefreshToken(user._id, tokens.refreshToken);

    return {
      error: false,
      message: 'User registered successfully',
      user: userDto,
      tokens,
    };
  },

  async login(username, password) {
    const user = await User.findOne({ username });

    if (!user) {
      throw ApiError.BadRequestError('A user with that username not exists');
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      throw ApiError.BadRequestError('This password is not correct');
    }

    const userDto = new UserDto(user);

    const tokens = tokensService.generateNewPairTokens({ ...userDto });

    await tokensService.saveRefreshToken(user._id, tokens.refreshToken);

    return {
      error: false,
      message: 'User authorization successfully',
      user: userDto,
      tokens,
    };
  },

  async logout(refreshToken) {
    const token = await tokensService.removeRefreshToken(refreshToken);

    return {
      error: false,
      message: 'User logout successfully',
      token,
    };
  },

  async refreshTokens(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokensService.validateRefreshToken(refreshToken);
    const dataFromDb = await tokensService.findRefreshToken(refreshToken);

    if (!userData || !dataFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findById(userData.id);

    const userDto = new UserDto(user);

    const tokens = tokensService.generateNewPairTokens({ ...userDto });

    await tokensService.saveRefreshToken(user._id, tokens.refreshToken);

    return {
      error: false,
      message: 'Refresh tokens successfully',
      user: userDto,
      tokens,
    };
  },
};

export default authService;
