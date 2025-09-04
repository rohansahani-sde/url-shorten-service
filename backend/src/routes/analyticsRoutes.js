const express = require('express');
const { authenticate } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

console.log("Loading analytics controller...");
const {
  getUrlAnalytics,
  getDashboardAnalytics
} = require('../controllers/analyticsController');
console.log("analytics controller loaded");

const router = express.Router();

router.use(apiLimiter);

router.get('/dashboard', authenticate, getDashboardAnalytics);
router.get('/:shortCode', authenticate, getUrlAnalytics);

module.exports = router;
