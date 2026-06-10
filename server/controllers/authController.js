const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id, expiresIn = process.env.JWT_EXPIRE || '1d') => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
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

// @desc   Trust this device
// @route  POST /api/auth/trust-device
// @access Private
const trustDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(400).json({ success: false, message: 'Device ID required' });
    }

    const user = await User.findById(req.user._id);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 hari

    // Hapus device lama kalau sudah expired
    user.trustedDevices = user.trustedDevices.filter(d => d.expiresAt > new Date());

    // Cek kalau deviceId sudah ada, update saja
    const existing = user.trustedDevices.find(d => d.deviceId === deviceId);
    if (existing) {
      existing.expiresAt = expiresAt;
    } else {
      user.trustedDevices.push({ deviceId, expiresAt });
    }

    await user.save();
    res.json({ success: true, message: 'Device trusted', expiresAt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc   Verify trusted device
// @route  POST /api/auth/verify-device
// @access Public
const verifyDevice = async (req, res) => {
  try {
    const { email, deviceId } = req.body;
    if (!email || !deviceId) {
      return res.status(400).json({ success: false, message: 'Email and device ID required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: false, trusted: false });
    }

    const device = user.trustedDevices.find(
      d => d.deviceId === deviceId && d.expiresAt > new Date()
    );

    if (!device) {
      return res.json({ success: true, trusted: false });
    }

    // Generate token baru
    const token = generateToken(user._id, '30d');

    res.json({
      success: true,
      trusted: true,
      token,
      user: { id: user._id, email: user.email, settings: user.settings },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const removeDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;
    const user = await User.findById(req.user._id);
    user.trustedDevices = user.trustedDevices.filter(d => d.deviceId !== deviceId);
    await user.save();
    res.json({ success: true, message: 'Device removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await User.findOne({ email });
    res.json({ success: true, exists: !!existing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = { register, login, verifyMasterPassword, getMe, updateSettings, trustDevice, verifyDevice, removeDevice, checkEmail}

