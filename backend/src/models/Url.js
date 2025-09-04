const mongoose = require('mongoose');

/**
 * URL Schema
 * Stores original URLs, short codes, and metadata
 */
const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL with http:// or https://'
    }
  },
  shortCode: {
    type: String,
    required: [true, 'Short code is required'],
    unique: true,
    index: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  clickCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: null // null means no expiration
  },
  customAlias: {
    type: String,
    sparse: true, // Allow multiple null values
    unique: true
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  tags: [{
    type: String,
    maxlength: 30
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better query performance
urlSchema.index({ owner: 1, createdAt: -1 });
urlSchema.index({ shortCode: 1, isActive: 1 });

/**
 * Virtual for the full short URL
 */
urlSchema.virtual('shortUrl').get(function() {
  return `${process.env.BASE_URL}/${this.shortCode}`;
});

/**
 * Increment click count atomically
 */
urlSchema.methods.incrementClickCount = function() {
  return this.constructor.findByIdAndUpdate(
    this._id,
    { $inc: { clickCount: 1 } },
    { new: true }
  );
};

/**
 * Check if URL is expired
 */
urlSchema.methods.isExpired = function() {
  return this.expiresAt && this.expiresAt < new Date();
};

module.exports = mongoose.model('Url', urlSchema);