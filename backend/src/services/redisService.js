const { getRedisClient } = require('../config/redis');

/**
 * Redis service for caching URL data
 * Implements caching strategies for frequently accessed URLs
 */
class RedisService {
  constructor() {
    this.client = null;
    this.defaultTTL = 3600; // 1 hour in seconds
  }

  /**
   * Initialize Redis client
   */
  init() {
    this.client = getRedisClient();
  }

  /**
   * Cache URL data by short code
   * @param {string} shortCode - Short code key
   * @param {Object} urlData - URL data to cache
   * @param {number} ttl - Time to live in seconds
   */
  async cacheUrl(shortCode, urlData, ttl = this.defaultTTL) {
    try {
      if (!this.client) this.init();
      
      const key = `url:${shortCode}`;
      await this.client.setEx(key, ttl, JSON.stringify(urlData));
      
      console.log(`Cached URL data for ${shortCode}`);
    } catch (error) {
      console.error('Error caching URL:', error.message);
    }
  }

  /**
   * Get cached URL data by short code
   * @param {string} shortCode - Short code key
   * @returns {Object|null} - Cached URL data or null
   */
  async getCachedUrl(shortCode) {
    try {
      if (!this.client) this.init();
      
      const key = `url:${shortCode}`;
      const cachedData = await this.client.get(key);
      
      if (cachedData) {
        console.log(`Cache hit for ${shortCode}`);
        return JSON.parse(cachedData);
      }
      
      console.log(`Cache miss for ${shortCode}`);
      return null;
    } catch (error) {
      console.error('Error getting cached URL:', error.message);
      return null;
    }
  }

  /**
   * Invalidate cached URL data
   * @param {string} shortCode - Short code key
   */
  async invalidateUrl(shortCode) {
    try {
      if (!this.client) this.init();
      
      const key = `url:${shortCode}`;
      await this.client.del(key);
      
      console.log(`Invalidated cache for ${shortCode}`);
    } catch (error) {
      console.error('Error invalidating cache:', error.message);
    }
  }

  /**
   * Cache user rate limit data
   * @param {string} userId - User ID
   * @param {number} count - Current request count
   * @param {number} windowTime - Time window in seconds
   */
  async setRateLimit(userId, count, windowTime) {
    try {
      if (!this.client) this.init();
      
      const key = `rate_limit:${userId}`;
      await this.client.setEx(key, windowTime, count.toString());
    } catch (error) {
      console.error('Error setting rate limit:', error.message);
    }
  }

  /**
   * Get user rate limit data
   * @param {string} userId - User ID
   * @returns {number|null} - Current request count or null
   */
  async getRateLimit(userId) {
    try {
      if (!this.client) this.init();
      
      const key = `rate_limit:${userId}`;
      const count = await this.client.get(key);
      
      return count ? parseInt(count) : null;
    } catch (error) {
      console.error('Error getting rate limit:', error.message);
      return null;
    }
  }

  /**
   * Increment rate limit counter
   * @param {string} userId - User ID
   * @param {number} windowTime - Time window in seconds
   * @returns {number} - New count value
   */
  async incrementRateLimit(userId, windowTime = 3600) {
    try {
      if (!this.client) this.init();
      
      const key = `rate_limit:${userId}`;
      
      // Use multi for atomic operations
      const multi = this.client.multi();
      multi.incr(key);
      multi.expire(key, windowTime);
      
      const results = await multi.exec();
      return results[0];
    } catch (error) {
      console.error('Error incrementing rate limit:', error.message);
      return 0;
    }
  }

  /**
   * Cache analytics data for quick access
   * @param {string} shortCode - Short code
   * @param {Object} analyticsData - Analytics summary data
   * @param {number} ttl - Time to live in seconds
   */
  async cacheAnalytics(shortCode, analyticsData, ttl = 1800) {
    try {
      if (!this.client) this.init();
      
      const key = `analytics:${shortCode}`;
      await this.client.setEx(key, ttl, JSON.stringify(analyticsData));
    } catch (error) {
      console.error('Error caching analytics:', error.message);
    }
  }

  /**
   * Get cached analytics data
   * @param {string} shortCode - Short code
   * @returns {Object|null} - Cached analytics data or null
   */
  async getCachedAnalytics(shortCode) {
    try {
      if (!this.client) this.init();
      
      const key = `analytics:${shortCode}`;
      const cachedData = await this.client.get(key);
      
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      console.error('Error getting cached analytics:', error.message);
      return null;
    }
  }
}

module.exports = new RedisService();