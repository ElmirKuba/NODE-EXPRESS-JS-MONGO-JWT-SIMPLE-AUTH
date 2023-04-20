import jsonwebtoken from 'jsonwebtoken';

import environment from './../environments/environment.js';

import Token from './../tokens/token.model.js';

const tokensService = {
  generateAccessToken(payload) {
    const accessToken = jsonwebtoken.sign(payload, environment.ACCESS_KEY_JWT, {
      expiresIn: '15s',
    });

    return accessToken;
  },

  generateRefreshToken(payload) {
    const refreshToken = jsonwebtoken.sign(
      payload,
      environment.REFRESH_KEY_JWT,
      { expiresIn: '30d' }
    );

    return refreshToken;
  },

  generateNewPairTokens(payload) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    const tokens = { accessToken, refreshToken };

    return tokens;
  },

  validateAccessToken(accessToken) {
    try {
      const userData = jsonwebtoken.verify(
        accessToken,
        environment.ACCESS_KEY_JWT
      );

      return userData;
    } catch (error) {
      return null;
    }
  },

  validateRefreshToken(refreshToken) {
    const userData = jsonwebtoken.verify(
      refreshToken,
      environment.REFRESH_KEY_JWT
    );

    return userData;
  },

  async saveRefreshToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;

      await tokenData.save();

      return tokenData;
    }

    const token = await Token({
      user: userId,
      refreshToken,
    });

    await token.save();

    return token;
  },

  async findRefreshToken(refreshToken) {
    const tokenData = await Token.findOne({ refreshToken });

    return tokenData;
  },

  async removeRefreshToken(refreshToken) {
    const tokenData = await Token.deleteOne({ refreshToken });

    return tokenData;
  },
};

export default tokensService;
