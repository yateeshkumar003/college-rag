const { AppError, FORBIDDEN } = require('../utils/errors');

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(FORBIDDEN, 'You do not have permission to perform this action', 403));
    }
    next();
  };
};

module.exports = restrictTo;
