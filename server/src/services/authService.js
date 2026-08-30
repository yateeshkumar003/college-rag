const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const { AppError } = require('../utils/errors');

/**
 * Helper to generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Register a new student
 */
const registerStudent = async (name, email, password) => {
  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('EMAIL_ALREADY_EXISTS', 'A user with this email already exists', 400);
  }

  // Create student user (explicitly force role: student)
  const user = await User.create({
    name,
    email,
    password,
    role: 'student'
  });

  const token = generateToken(user._id);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  };
};

/**
 * Log in a user (student or admin)
 */
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  };
};

/**
 * Get profile details by user ID
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError('USER_NOT_FOUND', 'User profile not found', 404);
  }
  return user;
};

module.exports = {
  registerStudent,
  loginUser,
  getUserProfile
};
