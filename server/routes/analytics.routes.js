// server/routes/analytics.routes.js
const express = require('express');
const router = express.Router();
const { getStatsOverview, getEngagementAnalytics } = require('../controllers/analytics.controller');
const ensureAuth = require('../middlewares/authMiddleware');

// @route   GET /api/stats
router.get('/stats', ensureAuth, getStatsOverview);

// @route   GET /api/analytics
router.get('/analytics', ensureAuth, getEngagementAnalytics);

module.exports = router;
