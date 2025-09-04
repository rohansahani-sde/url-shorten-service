const Analytics = require('../models/Analytics');
const Url = require('../models/Url');
const redisService = require('../services/redisService');

/**
 * Get analytics for a specific URL
 * @route GET /api/analytics/:shortCode
 */
const getUrlAnalytics = async (req, res) => {
  try {
    
    const { shortCode } = req.params;
    const userId = req.user._id;
    const { startDate, endDate, period = '30d' } = req.query;
    
    // Find URL and verify ownership
    const url = await Url.findOne({ shortCode, owner: userId });
    
    if (!url) {
      return res.status(404).json({ message: 'URL not found or access denied' });
    }

    // Check cache first
    const cacheKey = `${shortCode}_${startDate || ''}_${endDate || ''}_${period}`;
    const cachedAnalytics = await redisService.getCachedAnalytics(cacheKey);
    
    if (cachedAnalytics) {
      return res.json({
        success: true,
        analytics: cachedAnalytics
      });
    }

    // Build date range
    const dateRange = buildDateRange(startDate, endDate, period);

    // Get analytics data
    const [
      totalStats,
      dailyClicks,
      deviceStats,
      browserStats,
      locationStats,
      referrerStats
    ] = await Promise.all([
      getTotalStats(url._id, dateRange),
      getDailyClickStats(url._id, dateRange),
      getDeviceStats(url._id, dateRange),
      getBrowserStats(url._id, dateRange),
      getLocationStats(url._id, dateRange),
      getReferrerStats(url._id, dateRange)
    ]);

    const analytics = {
      url: {
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        totalClicks: url.clickCount
      },
      period: {
        startDate: dateRange.start,
        endDate: dateRange.end
      },
      stats: totalStats,
      charts: {
        dailyClicks,
        devices: deviceStats,
        browsers: browserStats,
        locations: locationStats,
        referrers: referrerStats
      }
    };

    // Cache the results
    await redisService.cacheAnalytics(cacheKey, analytics, 1800); // 30 minutes

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

/**
 * Get dashboard analytics summary
 * @route GET /api/analytics/dashboard
 */
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '30d' } = req.query;

    // Build date range
    const dateRange = buildDateRange(null, null, period);

    // Get user's URLs
    const userUrls = await Url.find({ owner: userId }).select('_id shortCode originalUrl clickCount');
    console.log(userUrls)

    if (userUrls.length === 0) {
      return res.json({
        success: true,
        analytics: {
          summary: {
            totalUrls: 0,
            totalClicks: 0,
            avgClicksPerUrl: 0,
            activeUrls: 0
          },
          topUrls: [],
          recentActivity: [],
          charts: {
            dailyClicks: [],
            devices: [],
            locations: []
          }
        }
      });
    }

    const urlIds = userUrls.map(url => url._id);

    // Get analytics data
    const [
      totalClicks,
      uniqueClicks,
      recentActivity,
      topUrls,
      dailyClicks,
      deviceStats,
      locationStats
    ] = await Promise.all([
      Analytics.countDocuments({ url: { $in: urlIds }, timestamp: { $gte: dateRange.start, $lte: dateRange.end } }),
      Analytics.countDocuments({ url: { $in: urlIds }, timestamp: { $gte: dateRange.start, $lte: dateRange.end }, isUnique: true }),
      getRecentActivity(urlIds, 15),
      getTopUrls(userUrls, 10),
      getDashboardDailyClicks(urlIds, dateRange),
      getDashboardDeviceStats(urlIds, dateRange),
      getDashboardLocationStats(urlIds, dateRange)
    ]);

    const analytics = {
      summary: {
        totalUrls: userUrls.length,
        totalClicks,
        uniqueClicks,
        avgClicksPerUrl: userUrls.length > 0 ? Math.round(totalClicks / userUrls.length) : 0,
        activeUrls: userUrls.filter(url => url.clickCount > 0).length
      },
      topUrls,
      recentActivity,
      charts: {
        dailyClicks,
        devices: deviceStats,
        locations: locationStats
      }
    };

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard analytics' });
  }
};




// Helper functions

/**
 * Build date range based on period or custom dates
 */
const buildDateRange = (startDate, endDate, period) => {
  const now = new Date();
  let start, end = now;

  if (startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
  } else {
    switch (period) {
      case '7d':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  return { start, end };
};

/**
 * Get total statistics for a URL
 */
const getTotalStats = async (urlId, dateRange) => {
  const pipeline = [
    {
      $match: {
        url: urlId,
        timestamp: { $gte: dateRange.start, $lte: dateRange.end }
      }
    },
    {
      $group: {
        _id: null,
        totalClicks: { $sum: 1 },
        uniqueClicks: { $sum: { $cond: ['$isUnique', 1, 0] } },
        uniqueCountries: { $addToSet: '$location.country' },
        uniqueDevices: { $addToSet: '$device' }
      }
    }
  ];

  const result = await Analytics.aggregate(pipeline);
  const stats = result[0] || {};

  return {
    totalClicks: stats.totalClicks || 0,
    uniqueClicks: stats.uniqueClicks || 0,
    uniqueCountries: (stats.uniqueCountries || []).filter(country => country && country !== 'Unknown').length,
    uniqueDevices: (stats.uniqueDevices || []).filter(device => device && device !== 'unknown').length
  };
};

/**
 * Get daily click statistics
 */
const getDailyClickStats = async (urlId, dateRange) => {
  const pipeline = [
    {
      $match: {
        url: urlId,
        timestamp: { $gte: dateRange.start, $lte: dateRange.end }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        clicks: { $sum: 1 },
        uniqueClicks: { $sum: { $cond: ['$isUnique', 1, 0] } }
      }
    },
    { $sort: { _id: 1 } }
  ];

  const results = await Analytics.aggregate(pipeline);
  
  return results.map(item => ({
    date: item._id,
    clicks: item.clicks,
    uniqueClicks: item.uniqueClicks
  }));
};

/**
 * Get device statistics
 */
const getDeviceStats = async (urlId, dateRange) => {
  const pipeline = [
    {
      $match: {
        url: urlId,
        timestamp: { $gte: dateRange.start, $lte: dateRange.end }
      }
    },
    {
      $group: {
        _id: '$device',
        count: { $sum: 1 },
        percentage: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ];

  const results = await Analytics.aggregate(pipeline);
  const total = results.reduce((sum, item) => sum + item.count, 0);

  return results.map(item => ({
    device: item._id || 'Unknown',
    count: item.count,
    percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
  }));
};

/**
 * Get browser statistics
 */
const getBrowserStats = async (urlId, dateRange) => {
  const pipeline = [
    {
      $match: {
        url: urlId,
        timestamp: { $gte: dateRange.start, $lte: dateRange.end }
      }
    },
    {
      $group: {
        _id: '$browser.name',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ];

  const results = await Analytics.aggregate(pipeline);
  
  return results.map(item => ({
    browser: item._id || 'Unknown',
    count: item.count
  }));
};

/**
 * Get location statistics
 */
const getLocationStats = async (urlId, dateRange) => {
  const pipeline = [
    {
      $match: {
        url: urlId,
        timestamp: { $gte: dateRange.start, $lte: dateRange.end }
      }
    },
    {
      $group: {
        _id: {
          country: '$location.country',
          countryCode: '$location.countryCode'
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ];

  const results = await Analytics.aggregate(pipeline);
  
  return results.map(item => ({
    country: item._id.country || 'Unknown',
    countryCode: item._id.countryCode || 'XX',
    count: item.count
  }));
};

// const getLocationStats = async (urlId, dateRange) => {
//   const pipeline = [
//     {
//       $match: {
//         url: new mongoose.Types.ObjectId(urlId),
//         timestamp: { $gte: dateRange.start, $lte: dateRange.end }
//       }
//     },
//     {
//       $group: {
//         _id: {
//           country: "$location.country",
//           countryCode: "$location.countryCode"
//         },
//         count: { $sum: 1 }
//       }
//     },
//     { $sort: { count: -1 } },
//     { $limit: 10 }
//   ];

//   return await Analytics.aggregate(pipeline);
// };

/**
 * Get referrer statistics
 */
const getReferrerStats = async (urlId, dateRange) => {
  const pipeline = [
    {
      $match: {
        url: urlId,
        timestamp: { $gte: dateRange.start, $lte: dateRange.end },
        referer: { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: '$referer',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ];

  const results = await Analytics.aggregate(pipeline);
  
  return results.map(item => ({
    referer: item._id,
    count: item.count
  }));
};

/**
 * Get recent activity
 */
const getRecentActivity = async (urlIds, limit = 10) => {
  const pipeline = [
    {
      $match: {
        url: { $in: urlIds }
      }
    },
    { $sort: { timestamp: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'urls',
        localField: 'url',
        foreignField: '_id',
        as: 'urlData'
      }
    },
    {
      $project: {
        shortCode: 1,
        timestamp: 1,
        'location.country': 1,
        device: 1,
        'browser.name': 1,
        'urlData.originalUrl': 1
      }
    }
  ];

  const results = await Analytics.aggregate(pipeline);
  
  return results.map(item => ({
    shortCode: item.shortCode,
    originalUrl: item.urlData[0]?.originalUrl || '',
    timestamp: item.timestamp,
    country: item.location?.country || 'Unknown',
    device: item.device || 'unknown',
    browser: item.browser?.name || 'Unknown'
  }));
};

/**
 * Get top performing URLs
 */
const getTopUrls = (urls, limit = 5) => {
  
  return urls
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, limit)
    .map(url => ({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clickCount: url.clickCount,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`
    }));
};


/**
 * Get dashboard daily clicks
 */
const getDashboardDailyClicks = async (urlIds, dateRange) => {
  const pipeline = [
    {
      $match: {
        url: { $in: urlIds },
        timestamp: { $gte: dateRange.start, $lte: dateRange.end }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        clicks: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ];

  const results = await Analytics.aggregate(pipeline);
  
  return results.map(item => ({
    date: item._id,
    clicks: item.clicks
  }));
};

/**
 * Get dashboard device statistics
 */
const getDashboardDeviceStats = async (urlIds, dateRange) => {
  const pipeline = [
    {
      $match: {
        url: { $in: urlIds },
        timestamp: { $gte: dateRange.start, $lte: dateRange.end }
      }
    },
    {
      $group: {
        _id: '$device',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ];

  const results = await Analytics.aggregate(pipeline);
  const total = results.reduce((sum, item) => sum + item.count, 0);

  return results.map(item => ({
    device: item._id || 'Unknown',
    count: item.count,
    percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
  }));
};

/**
 * Get dashboard location statistics
 */
const getDashboardLocationStats = async (urlIds, dateRange) => {
  const pipeline = [
    {
      $match: {
        url: { $in: urlIds },
        timestamp: { $gte: dateRange.start, $lte: dateRange.end }
      }
    },
    {
      $group: {
        _id: '$location.country',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ];

  const results = await Analytics.aggregate(pipeline);
  
  return results.map(item => ({
    country: item._id || 'Unknown',
    count: item.count
  }));
};

module.exports = {
  getUrlAnalytics,
  getDashboardAnalytics
};
