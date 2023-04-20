import ApiError from '../classes/api-error.class.js';

const errorMiddleware = (error, request, response, next) => {
  console.log(error);

  if (error instanceof ApiError) {
    response.status(error.status).json({
      error: true,
      status: error.status,
      message: error.message,
      errors: error.errors,
    });

    return;
  }

  response.status(500).json({
    error: true,
    status: 500,
    message: 'Unexpected error',
  });

  return;
};

export default errorMiddleware;
