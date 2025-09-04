const Url = require('../models/Url');
const User = require('../models/User');
const Analytics = require('../models/Analytics');
const redisService = require('../services/redisService');
const geoService = require('../services/geoService');
const { generateShortCode, validateCustomAlias, isAliasAvailable } = require('../utils/shortCodeGenerator');
const { parseUserAgent } = require('../utils/userAgentParser');
const validator = require('validator');

/**
 * Create a new short URL
 * @route POST /api/urls
 */
const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, description, tags, expiresAt } = req.body;
    const userId = req.user._id;

    // Validate original URL
    if (!originalUrl) {
      return res.status(400).json({ message: 'Original URL is required' });
    }

    if (!validator.isURL(originalUrl, { require_protocol: true })) {
      return res.status(400).json({ message: 'Please provide a valid URL with http:// or https://' });
    }

    let shortCode;

    // Handle custom alias
    if (customAlias) {
      if (!validateCustomAlias(customAlias)) {
        return res.status(400).json({ 
          message: 'Custom alias must be 3-20 characters long and contain only letters, numbers, hyphens, and underscores' 
        });
      }

      const isAvailable = await isAliasAvailable(customAlias);
      if (!isAvailable) {
        return res.status(400).json({ message: 'Custom alias is already taken' });
      }

      shortCode = customAlias;
    } else {
      // Generate random short code
      shortCode = await generateShortCode();
    }

    // Validate expiration date
    let expirationDate = null;
    if (expiresAt) {
      expirationDate = new Date(expiresAt);
      if (expirationDate <= new Date()) {
        return res.status(400).json({ message: 'Expiration date must be in the future' });
      }
    }

    // Create URL document
    const urlData = {
      originalUrl: originalUrl.trim(),
      shortCode,
      owner: userId,
      customAlias: customAlias || null,
      description: description?.trim() || null,
      tags: tags?.map(tag => tag.trim()).filter(tag => tag.length > 0) || [],
      expiresAt: expirationDate
    };

    const url = await Url.create(urlData);

    // Update user URL count
    await User.findByIdAndUpdate(userId, { $inc: { urlCount: 1 } });

    // Cache the URL data
    await redisService.cacheUrl(shortCode, {
      _id: url._id.toString(),
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      owner: url.owner.toString(),
      isActive: url.isActive,
      expiresAt: url.expiresAt
    });

    res.status(201).json({
      success: true,
      message: 'Short URL created successfully',
      url: {
        id: url._id,
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        shortCode: url.shortCode,
        clickCount: url.clickCount,
        description: url.description,
        tags: url.tags,
        expiresAt: url.expiresAt,
        createdAt: url.createdAt
      }
    });

  } catch (error) {
    console.error('Create URL error:', error);
    res.status(500).json({ 
      message: 'Server error creating short URL' ,
      error: error.message,   // 👈 add this
    stack: error.stack 
    });
    
  }
};

/**
 * Get user's URLs with pagination
 * @route GET /api/urls
 */
const getUserUrls = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const search = req.query.search;

    // Build query
    const query = { owner: userId };
    
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await Url.countDocuments(query);

    // Get URLs with pagination
    const urls = await Url.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // Add full short URL to each item
    const urlsWithShortUrl = urls.map(url => ({
      ...url,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`
    }));

    res.json({
      success: true,
      urls: urlsWithShortUrl,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get URLs error:', error);
    res.status(500).json({ message: 'Server error fetching URLs' });
  }
};

/**
 * Get single URL details
 * @route GET /api/urls/:id
 */
const getUrlById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const url = await Url.findOne({ _id: id, owner: userId });

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    res.json({
      success: true,
      url: {
        id: url._id,
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        shortCode: url.shortCode,
        clickCount: url.clickCount,
        description: url.description,
        tags: url.tags,
        expiresAt: url.expiresAt,
        isActive: url.isActive,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt
      }
    });

  } catch (error) {
    console.error('Get URL by ID error:', error);
    res.status(500).json({ message: 'Server error fetching URL' });
  }
};

/**
 * Update URL
 * @route PUT /api/urls/:id
 */
const updateUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, tags, isActive } = req.body;

    const url = await Url.findOne({ _id: id, owner: userId });

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Build update object
    const updateData = {};
    
    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }
    
    if (tags !== undefined) {
      updateData.tags = tags?.map(tag => tag.trim()).filter(tag => tag.length > 0) || [];
    }
    
    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    // Update URL
    const updatedUrl = await Url.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    // Invalidate cache
    await redisService.invalidateUrl(updatedUrl.shortCode);

    res.json({
      success: true,
      message: 'URL updated successfully',
      url: {
        _id: updatedUrl._id,
        originalUrl: updatedUrl.originalUrl,
        shortUrl: updatedUrl.shortUrl,
        shortCode: updatedUrl.shortCode,
        clickCount: updatedUrl.clickCount,
        description: updatedUrl.description,
        tags: updatedUrl.tags,
        expiresAt: updatedUrl.expiresAt,
        isActive: updatedUrl.isActive,
        createdAt: updatedUrl.createdAt,
        updatedAt: updatedUrl.updatedAt
      }
    });

  } catch (error) {
    console.error('Update URL error:', error);
    res.status(500).json({ message: 'Server error updating URL' });
  }
};

/**
 * Delete URL
 * @route DELETE /api/urls/:id
 */
const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const url = await Url.findOne({ _id: id, owner: userId });

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Delete URL and associated analytics
    await Promise.all([
      Url.findByIdAndDelete(id),
      Analytics.deleteMany({ url: id })
    ]);

    // Update user URL count
    await User.findByIdAndUpdate(userId, { $inc: { urlCount: -1 } });

    // Invalidate cache
    await redisService.invalidateUrl(url.shortCode);

    res.json({
      success: true,
      message: 'URL deleted successfully'
    });

  } catch (error) {
    console.error('Delete URL error:', error);
    res.status(500).json({ message: 'Server error deleting URL' });
  }
};

/**
 * Redirect to original URL and log analytics
 * @route GET /:shortCode
 */
// const redirectUrl = async (req, res) => {
//   try {
//     const { shortCode } = req.params;

//     // Try to get from cache first
//     let urlData = await redisService.getCachedUrl(shortCode);

//     if (!urlData) {
//       // Get from database
//       const url = await Url.findOne({ shortCode, isActive: true });

//       if (!url) {
//         return res.status(404).json({ message: 'URL not found or inactive' });
//       }

//       // Check if expired
//       if (url.isExpired()) {
//         return res.status(410).json({ message: 'URL has expired' });
//       }

//       urlData = {
//         _id: url._id.toString(),
//         originalUrl: url.originalUrl,
//         shortCode: url.shortCode,
//         owner: url.owner.toString(),
//         isActive: url.isActive,
//         expiresAt: url.expiresAt,
//         clickCount: url.clickCount   // 👈 add this
//       };

//       // Cache for future requests
//       await redisService.cacheUrl(shortCode, urlData);
//     } else {
//       // Check expiration for cached data
//       if (urlData.expiresAt && new Date(urlData.expiresAt) <= new Date()) {
//         return res.status(410).json({ message: 'URL has expired' });
//       }
//     }

//     // Parse user agent and get IP
//     const userAgent = req.get('User-Agent') || '';
//     const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
//     const referer = req.get('Referer') || null;

//     // Parse user agent data
//     const agentData = parseUserAgent(userAgent);

//     // Get geolocation (async - don't wait for it)
//     const locationPromise = geoService.getLocationFromIP(ip);

//     // Increment click count (async - don't wait for it)
//     const incrementPromise = Url.findByIdAndUpdate(
//       urlData._id,
//       { $inc: { clickCount: 1 } },
//       { new: true }
//     );

//     // Create analytics record (async - don't wait for it)
//     const analyticsPromise = locationPromise.then(location => {
//       console.log(agentData.browser)
//       return Analytics.create({
//         url: urlData._id,
//         shortCode,
//         ip,
//         userAgent,
//         browser: agentData.browser,
//         os: agentData.os,
//         device: agentData.device,
//         location,
//         referer,
//         isBot: agentData.isBot,
//         timestamp: new Date()
//       });
//     });

//     // Execute async operations (don't wait)
//     Promise.all([incrementPromise, analyticsPromise]).catch(error => {
//       console.error('Error updating analytics:', error);
//     });

//     // Redirect immediately
//     res.redirect(301, urlData.originalUrl);

//   } catch (error) {
//     console.error('Redirect error:', error);
//     res.status(500).json({ message: 'Server error during redirect' });
//   }
// };
const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Atomic update + fetch
    const url = await Url.findOneAndUpdate(
      { 
        shortCode, 
        isActive: true, 
        $or: [
          { expiresAt: null },
          { expiresAt: { $gt: new Date() } }
          ]
        },
        { $inc: { clickCount: 1 } },
        { new: true }
      );


    if (!url) {
      return res.status(404).json({ message: "URL not found or inactive" });
    }

    // Parse user agent and IP
    const userAgent = req.get("User-Agent") || "";
    const ip = req.ip || req.connection.remoteAddress || "127.0.0.1";
    const referer = req.get("Referer") || null;
    const agentData = parseUserAgent(userAgent);

    // Async analytics save
    geoService.getLocationFromIP(ip).then((location) => {
      Analytics.create({
        url: url._id,
        shortCode,
        ip,
        userAgent,
        browser: agentData.browser,
        os: agentData.os,
        device: agentData.device,
        location,
        referer,
        isBot: agentData.isBot,
        timestamp: new Date(),
      }).catch((err) =>
        console.error("Error saving analytics:", err.message)
      );
    });

    // Redirect immediately
    // res.redirect(301, url.originalUrl);
    res.redirect(302, url.originalUrl);

  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ message: "Server error during redirect" });
  }
};




module.exports = {
  createShortUrl,
  getUserUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  redirectUrl
};