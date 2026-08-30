const express = require('express');
const adminController = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const restrictTo = require('../middleware/roleMiddleware');

const router = express.Router();

// Guard admin endpoints (requires authenticating and admin authorization role separation)
router.use(protect);
router.use(restrictTo('admin'));

// Fetch admin dashboard stats (GET /api/admin/dashboard)
router.get('/dashboard', adminController.getDashboardStats);

module.exports = router;
