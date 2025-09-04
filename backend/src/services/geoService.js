const fetch = require('node-fetch');

/**
 * Get geographic information from IP address
 * Uses free IP geolocation service (replace with preferred service)
 * @param {string} ip - IP address to lookup
 * @returns {Object} - Geographic information
 */
const getLocationFromIP = async (ip) => {
  try {
    // Skip localhost and private IPs
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return {
        country: 'Unknown',
        countryCode: 'XX',
        region: 'Unknown',
        city: 'Unknown',
        timezone: 'Unknown',
        coordinates: { lat: 0, lon: 0 }
      };
    }

    // Using ipapi.co (free tier: 1000 requests/day)
    // You can replace this with your preferred geolocation service
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      timeout: 5000,
      headers: {
        'User-Agent': 'URL-Shortener/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'XX',
      region: data.region || 'Unknown',
      city: data.city || 'Unknown',
      timezone: data.timezone || 'Unknown',
      coordinates: {
        lat: parseFloat(data.latitude) || 0,
        lon: parseFloat(data.longitude) || 0
      }
    };

  } catch (error) {
    console.error('Error getting location from IP:', error.message);
    
    // Return default location data on error
    return {
      country: 'Unknown',
      countryCode: 'XX',
      region: 'Unknown',
      city: 'Unknown',
      timezone: 'Unknown',
      coordinates: { lat: 0, lon: 0 }
    };
  }
};

/**
 * Batch process multiple IP addresses
 * @param {Array} ips - Array of IP addresses
 * @returns {Array} - Array of location objects
 */
const batchGetLocations = async (ips) => {
  const locations = await Promise.allSettled(
    ips.map(ip => getLocationFromIP(ip))
  );

  return locations.map((result, index) => ({
    ip: ips[index],
    location: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason.message : null
  }));
};

module.exports = {
  getLocationFromIP,
  batchGetLocations
};