const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';

  if (env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      error: err.errorCode,
      message: err.message,
      stack: err.stack,
      err: err
    });
  } else {
    // Production output
    res.status(err.statusCode).json({
      success: false,
      error: err.errorCode,
      message: err.message
    });
  }
};

module.exports = errorHandler;
