const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

/**
 * User Schema
 * Handles both local (email/password) and social (Google) auth
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // don’t expose password
  },
  profilePic: {
    type: String, // store Google profile pic
    default: null,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  urlCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

/**
 * Hash password only if provider is local and password is modified
 */
userSchema.pre('save', async function (next) {
  if (this.authProvider === 'google') return next(); // skip hashing for Google users
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Compare passwords (only for local users)
 */
userSchema.methods.correctPassword = async function (candidatePassword) {
  if (!this.password) return false; // google users don't have password
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Update last login timestamp
 */
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('User', userSchema);






// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const validator = require('validator');

// /**
//  * User Schema
//  * Stores user authentication and profile information
//  */
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'name is required'],
//      trim: true,
//   },
//   username: {
//     type: String,
//     required: [true, 'Username is required'],
//     unique: true,
//     trim: true,
//     minlength: [3, 'Username must be at least 3 characters'],
//     maxlength: [30, 'Username cannot exceed 30 characters']
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     validate: [validator.isEmail, 'Please provide a valid email']
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [6, 'Password must be at least 6 characters'],
//     select: false // Don't include password in queries by default
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   lastLogin: {
//     type: Date
//   },
//   urlCount: {
//     type: Number,
//     default: 0
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // ❌ Removed duplicate indexes (unique already adds them)

// /**
//  * Hash password before saving
//  */
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// /**
//  * Compare provided password with stored hash
//  * @param {string} candidatePassword - Password to compare
//  * @returns {boolean} - True if passwords match
//  */
// userSchema.methods.correctPassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// /**
//  * Update last login timestamp
//  */
// userSchema.methods.updateLastLogin = function() {
//   this.lastLogin = new Date();
//   return this.save({ validateBeforeSave: false });
// };

// module.exports = mongoose.model('User', userSchema);
