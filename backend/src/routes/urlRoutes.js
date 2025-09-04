const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { apiLimiter, urlCreationLimiter } = require('../middleware/rateLimiter');
const {
  createShortUrl,
  getUserUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  redirectUrl
} = require('../controllers/urlController');

const router = express.Router();

/**
 * @route   POST /api/urls
 * @desc    Create a new short URL
 * @access  Private
 */
router.post('/', authenticate, urlCreationLimiter, createShortUrl);

/**
 * @route   GET /api/urls
 * @desc    Get user's URLs with pagination
 * @access  Private
 */
router.get('/', authenticate, apiLimiter, getUserUrls);

/**
 * @route   GET /api/urls/:id
 * @desc    Get single URL details
 * @access  Private
 */
router.get('/:id', authenticate, getUrlById);

/**
 * @route   PUT /api/urls/:id
 * @desc    Update URL
 * @access  Private
 */
router.put('/:id', authenticate, updateUrl);

/**
 * @route   DELETE /api/urls/:id
 * @desc    Delete URL
 * @access  Private
 */
router.delete('/:id', authenticate, deleteUrl);

module.exports = router;