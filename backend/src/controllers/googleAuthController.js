const admin = require("../firebaseAdmin");
const User = require("../models/User");
const jwt = require('jsonwebtoken');


const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 📌 Google Login/Register
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "No Google token provided" });
    }

    // Verify Google token with Firebase Admin
    const decoded = await admin.auth().verifyIdToken(idToken);

    let user = await User.findOne({ email: decoded.email });

    if (!user) {
      // First time → create user
      user = await User.create({
        name: decoded.name || "No Name",
        username: decoded.email.split("@")[0],
        email: decoded.email,
        profilePic: decoded.picture || null, 
        authProvider: "google", 
        password: Math.random().toString(36).slice(-8), // dummy password
      });
    }

    const token = generateToken(user._id);
    await user.updateLastLogin();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePic: decoded.picture || null, 
        urlCount: user.urlCount,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};
