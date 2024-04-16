const { NODE_ENV } = require('../config');

class CustomError extends Error {
  constructor(status = 500, message = "Internal Server Error") {
      super(message);
      this.status = status;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
  }
}

module.exports.createError = (status, message) => {
  return new CustomError(status, message);
};

module.exports.errorHandler = (err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  const errorResponse = {
      success: false,
      status: errorStatus,
      message: errorMessage
  };

  if (NODE_ENV === 'development') {
      errorResponse.stack = err.stack;
  }

  return res.status(errorStatus).json(errorResponse);
};