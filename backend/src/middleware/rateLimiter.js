const rateLimit = require('express-rate-limit');
const redisService = require('../services/redisService');

/**
 * Create rate limiter for general API usage (IP based)
 * Works with express-rate-limit v7+
 */
const createRateLimiter = (windowMs = 15 * 60 * 1000, limit = 100) => {
  return rateLimit({
    windowMs,                     // how long to keep records (15 min default)
    limit,                        // max requests per window
    standardHeaders: 'draft-7',   // use modern RateLimit-* headers
    legacyHeaders: false,         // disable X-RateLimit-* headers
    handler: (req, res, _next, options) => {
      res.status(options.statusCode).json({
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

/**
 * User-specific rate limiter using Redis
 * Limits authenticated users based on their user ID
 */
// const userRateLimiter = (maxRequests = 50, windowTime = 3600) => {
const userRateLimiter = (maxRequests = 5000, windowTime = 3600) => {
  return async (req, res, next) => {
    try {
      // Skip if user is not authenticated
      if (!req.user) {
        return next();
      }

      const userId = req.user._id.toString();
      const currentCount = await redisService.getRateLimit(userId);

      if (currentCount !== null && currentCount >= maxRequests) {
        return res.status(429).json({
          message: 'Rate limit exceeded. Too many requests.',
          retryAfter: windowTime,
          limit: maxRequests,
          current: currentCount
        });
      }

      // Increment counter in Redis
      const newCount = await redisService.incrementRateLimit(userId, windowTime);

      // Set headers for visibility
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': Math.max(0, maxRequests - newCount),
        'X-RateLimit-Reset': new Date(Date.now() + windowTime * 1000).toISOString()
      });

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Continue on error to not block requests
      next();
    }
  };
};

/**
 * Specific rate limiters
 */
const urlCreationLimiter = userRateLimiter(20, 3600);        // 20 URLs per hour
// const apiLimiter = createRateLimiter(15 * 60 * 1000, 100);   // 100 requests / 15 min
const apiLimiter = createRateLimiter(15 * 60 * 1000, 1000);
// const authLimiter = createRateLimiter(15 * 60 * 1000, 10);   // 10 attempts / 15 min
const authLimiter = createRateLimiter(15 * 60 * 1000, 100);

module.exports = {
  createRateLimiter,
  userRateLimiter,
  urlCreationLimiter,
  apiLimiter,
  authLimiter
};
