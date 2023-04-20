class UserDto {
  id = null;
  username = null;
  roles = null;

  constructor(model) {
    this.id = model._id;
    this.username = model.username;
    this.roles = model.roles;
  }
}

export default UserDto;
