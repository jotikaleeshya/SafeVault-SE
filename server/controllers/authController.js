const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc   Register / Create new vault
// @route  POST /api/auth/register
// @access Public
const register = async (req, res) => {
  try {
    const { email, masterPassword } = req.body;

    if (!email || !masterPassword) {
      return res.status(400).json({ success: false, message: 'Email and master password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({ email, masterPassword });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, email: user.email, settings: user.settings },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Login
// @route  POST /api/auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { email, masterPassword } = req.body;

    if (!email || !masterPassword) {
      return res.status(400).json({ success: false, message: 'Email and master password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.verifyMasterPassword(masterPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, settings: user.settings },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Verify master password (for viewing sensitive data)
// @route  POST /api/auth/verify-master
// @access Private
const verifyMasterPassword = async (req, res) => {
  try {
    const { masterPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.verifyMasterPassword(masterPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect master password' });
    }

    res.json({ success: true, message: 'Master password verified' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get current user profile
// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @desc   Update user settings
// @route  PATCH /api/auth/settings
// @access Private
const updateSettings = async (req, res) => {
  try {
    const { autofill } = req.body;
    if (typeof autofill !== 'boolean') {
      return res.status(400).json({ success: false, message: 'autofill must be a boolean' });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'settings.autofill': autofill },
      { new: true, select: '-masterPassword' }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, verifyMasterPassword, getMe, updateSettings };