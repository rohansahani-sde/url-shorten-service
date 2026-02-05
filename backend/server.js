const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./src/config/database');
const { connectRedis } = require('./src/config/redis');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const urlRoutes = require('./src/routes/urlRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
// Add this at the top with other imports
const urlController = require('./src/controllers/urlController');

const path = require('path');



const app = express();


const _dirname = path.resolve();

// Connect to MongoDB
connectDB();

// Connect to Redis
// connectRedis();

// Middleware
app.use(helmet()); // Security headers
const corsOptions = {
  origin: "http://localhost:5173/",
  credentials: true
}
app.use(cors(corsOptions)); // Enable CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


app.get('/:shortCode', urlController.redirectUrl);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get('/:path', (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
})



// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;