const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');

const router = express.Router();

// Register router (Student only)
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  validate,
  authController.register
);

// Login router
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.login
);

// Me router (Protected)
router.get('/me', protect, authController.getMe);

module.exports = router;
