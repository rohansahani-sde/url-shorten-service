const { nanoid } = require('nanoid');
const Url = require('../models/Url');

/**
 * Generate a unique short code for URLs
 * Uses nanoid for URL-safe random string generation
 * @param {number} length - Length of the short code (default: 6)
 * @returns {string} - Unique short code
 */
const generateShortCode = async (length = 6) => {
  let shortCode;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 5;

  while (!isUnique && attempts < maxAttempts) {
    // Generate URL-safe short code
    shortCode = nanoid(length);
    
    // Check if this code already exists
    const existingUrl = await Url.findOne({ shortCode });
    
    if (!existingUrl) {
      isUnique = true;
    } else {
      attempts++;
      // Increase length if we're having collisions
      if (attempts >= maxAttempts - 1) {
        length++;
      }
    }
  }

  if (!isUnique) {
    throw new Error('Unable to generate unique short code');
  }

  return shortCode;
};

/**
 * Validate custom alias for short URLs
 * @param {string} alias - Custom alias to validate
 * @returns {boolean} - True if valid
 */
const validateCustomAlias = (alias) => {
  // Only allow alphanumeric characters, hyphens, and underscores
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  return validPattern.test(alias) && alias.length >= 3 && alias.length <= 20;
};

/**
 * Check if custom alias is available
 * @param {string} alias - Custom alias to check
 * @returns {boolean} - True if available
 */
const isAliasAvailable = async (alias) => {
  const existingUrl = await Url.findOne({ 
    $or: [
      { shortCode: alias },
      { customAlias: alias }
    ]
  });
  
  return !existingUrl;
};

module.exports = {
  generateShortCode,
  validateCustomAlias,
  isAliasAvailable
};