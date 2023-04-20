class ApiError extends Error {
  status = null;
  errors = null;

  constructor(status, message, errors = []) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User not authorized');
  }

  static BadRequestError(message, errors = []) {
    return new ApiError(400, message, errors);
  }
}

export default ApiError;
