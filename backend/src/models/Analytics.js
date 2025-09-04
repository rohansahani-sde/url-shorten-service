const mongoose = require('mongoose');

/**
 * Analytics Schema
 * Stores detailed analytics data for URL clicks
 */
const analyticsSchema = new mongoose.Schema({
  url: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
    index: true
  },
  shortCode: {
    type: String,
    required: true,
    index: true
  },
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  // Parsed user agent data
  browser: {
    name: String,
    version: String
  },
  os: {
    name: String,
    version: String
  },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'unknown'],
    default: 'unknown'
  },
  // Geo-location data (from IP)
  location: {
    country: String,
    countryCode: String,
    region: String,
    city: String,
    timezone: String,
    coordinates: {
      lat: Number,
      lon: Number
    }
  },
  // Request metadata
  referer: String,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  // Processed flags
  isBot: {
    type: Boolean,
    default: false
  },
  isUnique: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: false // We use custom timestamp field
});

// Compound indexes for analytics queries
analyticsSchema.index({ url: 1, timestamp: -1 });
analyticsSchema.index({ shortCode: 1, timestamp: -1 });
analyticsSchema.index({ 'location.country': 1, timestamp: -1 });
analyticsSchema.index({ device: 1, timestamp: -1 });

/**
 * Static method to get analytics summary for a URL
 * @param {ObjectId} urlId - URL document ID
 * @param {Object} dateRange - Start and end dates
 * @returns {Object} Analytics summary
 */
analyticsSchema.statics.getAnalyticsSummary = async function(urlId, dateRange = {}) {
  const match = { url: urlId };
  
  if (dateRange.start && dateRange.end) {
    match.timestamp = {
      $gte: new Date(dateRange.start),
      $lte: new Date(dateRange.end)
    };
  }

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: null,
        totalClicks: { $sum: 1 },
        uniqueClicks: { $sum: { $cond: ['$isUnique', 1, 0] } },
        countries: { $addToSet: '$location.country' },
        devices: { $push: '$device' },
        browsers: { $push: '$browser.name' },
        dailyClicks: {
          $push: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: 1
          }
        }
      }
    }
  ];

  const result = await this.aggregate(pipeline);
  return result[0] || {};
};

module.exports = mongoose.model('Analytics', analyticsSchema);