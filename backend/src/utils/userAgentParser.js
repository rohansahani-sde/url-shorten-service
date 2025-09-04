const parser = require('user-agent-parser');

/**
 * Parse user agent string to extract browser, OS, and device information
 * @param {string} userAgent - Raw user agent string
 * @returns {Object} - Parsed user agent data
 */
const parseUserAgent = (userAgent) => {
  try {
    const parsed = parser(userAgent);
    
    // Determine device type based on user agent
    const deviceType = determineDeviceType(userAgent, parsed);
    
    // Check if it's likely a bot
    const isBot = detectBot(userAgent);

    return {
      browser: {
        name: parsed.browser.name || 'Unknown',
        version: parsed.browser.version || 'Unknown'
      },
      os: {
        name: parsed.os.name || 'Unknown',
        version: parsed.os.version || 'Unknown'
      },
      device: deviceType,
      isBot,
      raw: userAgent
    };
  } catch (error) {
    console.error('Error parsing user agent:', error);
    return {
      browser: { name: 'Unknown', version: 'Unknown' },
      os: { name: 'Unknown', version: 'Unknown' },
      device: 'unknown',
      isBot: false,
      raw: userAgent
    };
  }
};

/**
 * Determine device type from user agent
 * @param {string} userAgent - Raw user agent string
 * @param {Object} parsed - Parsed user agent object
 * @returns {string} - Device type: desktop, mobile, tablet, or unknown
 */
const determineDeviceType = (userAgent, parsed) => {
  const ua = userAgent.toLowerCase();
  
  // Check for mobile devices
  if (/mobile|android|iphone|ipod|blackberry|windows phone/.test(ua)) {
    return 'mobile';
  }
  
  // Check for tablets
  if (/tablet|ipad/.test(ua)) {
    return 'tablet';
  }
  
  // Check for known desktop OS
  if (parsed.os.name && /windows|mac|linux|ubuntu/.test(parsed.os.name.toLowerCase())) {
    return 'desktop';
  }
  
  return 'unknown';
};

/**
 * Detect if user agent is likely a bot/crawler
 * @param {string} userAgent - Raw user agent string
 * @returns {boolean} - True if likely a bot
 */
const detectBot = (userAgent) => {
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'parser',
    'google', 'bing', 'yahoo', 'facebook', 'twitter',
    'linkedin', 'pinterest', 'slack', 'discord',
    'wget', 'curl', 'python', 'java', 'node.js'
  ];
  
  const ua = userAgent.toLowerCase();
  return botPatterns.some(pattern => ua.includes(pattern));
};

/**
 * Get simplified browser name for analytics
 * @param {string} browserName - Full browser name
 * @returns {string} - Simplified browser name
 */
const simplifyBrowserName = (browserName) => {
  const browser = browserName.toLowerCase();
  
  if (browser.includes('chrome')) return 'Chrome';
  if (browser.includes('firefox')) return 'Firefox';
  if (browser.includes('safari')) return 'Safari';
  if (browser.includes('edge')) return 'Edge';
  if (browser.includes('opera')) return 'Opera';
  if (browser.includes('internet explorer')) return 'IE';
  
  return browserName || 'Unknown';
};

module.exports = {
  parseUserAgent,
  detectBot,
  simplifyBrowserName
};
