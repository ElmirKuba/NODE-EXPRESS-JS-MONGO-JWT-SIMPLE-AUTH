import User from './user.model.js';

const userService = {
  async getAllUsers() {
    const users = await User.find();

    return users;
  },
};

export default userService;
