const { createClient } = require('redis');

let client;

const connectRedis = async () => {
  try {
    client = createClient({
      url: process.env.REDIS_URL,  // Use cloud URL instead of localhost
    });

    client.on('error', (err) => console.error('Redis Client Error:', err));
    await client.connect();
    console.log('✅ Redis connected');
  } catch (err) {
    console.error('❌ Redis connection failed:', err.message);
  }
};

module.exports = { connectRedis, getClient: () => client };
