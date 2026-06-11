const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/authRoutes');
const urlRoutes = require('./src/routes/urlRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const urlController = require('./src/controllers/urlController');

const app = express();

const requireEnv = (name) => {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
};

requireEnv('MONGODB_URI');
requireEnv('JWT_SECRET');

const NODE_ENV = process.env.NODE_ENV || 'production';

if (NODE_ENV === 'production') {
  const corsOriginsRaw = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN;
  if (!corsOriginsRaw) {
    console.warn('[WARN] NODE_ENV=production but no CORS_ORIGINS set.');
  }
}

connectDB();

app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);

app.disable('x-powered-by');
app.use(compression());
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

const parseOrigins = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value).split(',').map((s) => s.trim()).filter(Boolean);
};

const allowedOrigins = parseOrigins(process.env.CORS_ORIGINS || process.env.CORS_ORIGIN);
console.log('[CORS] Allowed Origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, false);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

// ✅ Only once + preflight handler uncommented
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV
  });
});

app.get('/:shortCode', urlController.redirectUrl);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[${NODE_ENV}] Server running on port ${PORT}`);
});

const gracefulShutdown = async (signal) => {
  console.log(`[${signal}] Shutting down...`);
  server.close(async (err) => {
    if (err) console.error('Error closing HTTP server:', err.message);
    else console.log('HTTP server closed.');
    try {
      const mongoose = require('mongoose');
      if (mongoose?.connection?.readyState) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
      }
    } catch (e) {
      console.error('Error during shutdown:', e.message);
    }
    process.exit(err ? 1 : 0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = app;