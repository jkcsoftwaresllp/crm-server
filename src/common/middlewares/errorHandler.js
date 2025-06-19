  const errorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';

  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message || 'Validation failed';
  }

  // Handle unauthorized/auth errors
  else if (err.name === 'UnauthorizedError' || err.statusCode === 401) {
    statusCode = 401;
    message = err.message || 'Unauthorized';
  }

  // Handle MySQL duplicate entry error
  else if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Duplicate entry';
  }

  // Custom statusCode from thrown error
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Log detailed error info in dev
  console.error(`[ERROR] ${err.stack || err}`);

  res.status(statusCode).json({
    success: false,
    message
  });
};

export { errorHandler };
