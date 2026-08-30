const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { AppError, AUTH_REQUIRED } = require('../utils/errors');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError(AUTH_REQUIRED, 'Not authorized, token missing', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return next(new AppError(AUTH_REQUIRED, 'User no longer exists', 401));
      }

      next();
    } catch (err) {
      return next(new AppError(AUTH_REQUIRED, 'Not authorized, token invalid', 401));
    }
  } catch (err) {
    next(err);
  }
};

module.exports = protect;
