const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Url = require('../models/Url');
const Analytics = require('../models/Analytics');
const validator = require('validator');

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * User registration
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    // Validation
    if ( !name || !username || !email || !password || !confirmPassword) {
      console.log("Missing fields:", { name, username, email, password, confirmPassword });
      return res.status(400).json({ message: 'All fields are required' });
    }


    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({ message: `User with this ${field} already exists` });
    }

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        urlCount: user.urlCount,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * User login
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
    
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        urlCount: user.urlCount,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};



/**
 * Get current user profile
 * @route GET /api/auth/me
 */
const getProfile = async (req, res) => {
  try {
    // User is already attached by auth middleware
    const user = await User.findById(req.user._id);

    // Calculate total and unique clicks
    const urlIds = await Url.find({ owner: user._id }).distinct('_id');
    const [urlStats, uniqueClicks] = await Promise.all([
      Url.aggregate([
        { $match: { owner: user._id } },
        { $group: { _id: null, totalClicks: { $sum: "$clickCount" } } }
      ]),
      Analytics.countDocuments({ url: { $in: urlIds }, isUnique: true })
    ]);

    const totalClicks = urlStats.length > 0 ? urlStats[0].totalClicks : 0;

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        photoURL: user.profilePic,
        urlCount: user.urlCount,
        totalClicks,
        uniqueClicks,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        bio: user.bio,
        title: user.title,
        location: user.location,
        website: user.website
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/profile
 */
// const updateProfile = async (req, res) => {
//   try {
//     const { username, email } = req.body;
//     const userId = req.user._id;

//     const updateData = {};

//     // Validate and add username if provided
//     if (username) {
//       if (username.length < 3 || username.length > 30) {
//         return res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
//       }
      
//       // Check if username is already taken
//       const existingUser = await User.findOne({ username, _id: { $ne: userId } });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Username already taken' });
//       }
      
//       updateData.username = username;
//     }

//     // Validate and add email if provided
//     if (email) {
//       if (!validator.isEmail(email)) {
//         return res.status(400).json({ message: 'Please provide a valid email' });
//       }
      
//       // Check if email is already taken
//       const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: userId } });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Email already taken' });
//       }
      
//       updateData.email = email.toLowerCase();
//     }

//     if (Object.keys(updateData).length === 0) {
//       return res.status(400).json({ message: 'No valid fields to update' });
//     }

//     // Update user
//     const user = await User.findByIdAndUpdate(
//       userId,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     res.json({
//       success: true,
//       message: 'Profile updated successfully',
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         urlCount: user.urlCount,
//         lastLogin: user.lastLogin,
//         createdAt: user.createdAt
//       }
//     });

//   } catch (error) {
//     console.error('Profile update error:', error);
//     res.status(500).json({ message: 'Server error updating profile' });
//   }
// };
const updateProfile = async (req, res) => {
  try {
    const { username, email, name, photoURL, bio, title, location, website } = req.body;
    const userId = req.user._id;

    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email.toLowerCase();
    if (name) updateData.name = name;
    if (photoURL !== undefined) updateData.profilePic = photoURL;
    if (bio !== undefined) updateData.bio = bio;
    if (title !== undefined) updateData.title = title;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    // Calculate total and unique clicks
    const urlIds = await Url.find({ owner: user._id }).distinct('_id');
    const [urlStats, uniqueClicks] = await Promise.all([
      Url.aggregate([
        { $match: { owner: user._id } },
        { $group: { _id: null, totalClicks: { $sum: "$clickCount" } } }
      ]),
      Analytics.countDocuments({ url: { $in: urlIds }, isUnique: true })
    ]);

    const totalClicks = urlStats.length > 0 ? urlStats[0].totalClicks : 0;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        photoURL: user.profilePic,
        urlCount: user.urlCount,
        totalClicks,
        uniqueClicks,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        bio: user.bio,
        title: user.title,
        location: user.location,
        website: user.website
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};



/**
 * Change password
 * @route PUT /api/auth/password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.user._id;

    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'All password fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    // Get user with password
    const user = await User.findById(userId).select('+password');

    // Verify current password
    const isCurrentPasswordValid = await user.correctPassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
};


// Get logged-in user's profile

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};