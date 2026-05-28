const VaultEntry = require('../models/VaultEntry');
const { encrypt, decrypt } = require('../utils/crypto')

// Helper: calculate password strength
const calculatePasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 10;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[a-z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;

  let label = 'Weak';
  if (score >= 80) label = 'Impenetrable';
  else if (score >= 60) label = 'Strong';
  else if (score >= 40) label = 'Fair';

  return { score: Math.min(score, 100), label };
};

// @desc   Get all vault entries for current user
// @route  GET /api/vault
// @access Private
const getEntries = async (req, res) => {
  try {
    const entries = await VaultEntry.find({ user: req.user._id })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true, 
      count: entries.length, 
      entries: entries.map(e => ({
        ...e.toObject(),
        username: decrypt(e.username),
        password: undefined
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single entry with decrypted password (requires verified session)
// @route  GET /api/vault/:id/reveal
// @access Private
const revealEntry = async (req, res) => {
  try {
    const entry = await VaultEntry.findOne({ _id: req.params.id, user: req.user._id });

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    res.json({ success: true, entry: {
      ...entry.toObject(),
      username: decrypt(entry.username),
      password: decrypt(entry.password),
    } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single entry metadata (no password)
// @route  GET /api/vault/:id
// @access Private
const getEntry = async (req, res) => {
  try {
    const entry = await VaultEntry.findOne({ _id: req.params.id, user: req.user._id }).select('-password');

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    res.json({ success: true, entry :{
      ...entry.toObject(),
      username: decrypt(entry.username),
      password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create new vault entry
// @route  POST /api/vault
// @access Private
const createEntry = async (req, res) => {
  try {
    const { siteName, siteURL, username, password } = req.body;

    if (!siteName || !siteURL || !username || !password) {
      return res.status(400).json({ success: false, message: 'Site name, site url, username, and password are required' });
    }

    const { score, label } = calculatePasswordStrength(password);

    const entry = await VaultEntry.create({
      user: req.user._id,
      siteName,
      siteURL,
      username: encrypt(username),
      password: encrypt(password),
      passwordStrength: label,
      strengthScore: score,
    });

    const entryObj = entry.toObject();
    delete entryObj.password;

    res.status(201).json({ success: true, entry: {
      ...entryObj, 
      username: decrypt(entryObj.username),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update vault entry
// @route  PUT /api/vault/:id
// @access Private
const updateEntry = async (req, res) => {
  try {
    const entry = await VaultEntry.findOne({ _id: req.params.id, user: req.user._id });

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    const { username, siteURL, password, isFavorite } = req.body;

    if (username !== undefined) entry.username = encrypt(username);
    if (siteURL !== undefined) entry.siteURL = siteURL;
    if (isFavorite !== undefined) entry.isFavorite = isFavorite;

    if (password !== undefined) {
      const { score, label } = calculatePasswordStrength(password);
      entry.password = encrypt(password);
      entry.passwordStrength = label;
      entry.strengthScore = score;
    }

    await entry.save();

    const entryObj = entry.toObject();
    delete entryObj.password;

    res.json({ success: true, entry: {
      ...entryObj,
      username: decrypt(entryObj.username),
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete vault entry
// @route  DELETE /api/vault/:id
// @access Private
const deleteEntry = async (req, res) => {
  try {
    const entry = await VaultEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    res.json({ success: true, message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get security analysis
// @route  GET /api/vault/security
// @access Private
const getSecurityAnalysis = async (req, res) => {
  try {
    const entries = await VaultEntry.find({ user: req.user._id }).select('siteName username passwordStrength strengthScore favicon createdAt updatedAt');

    const strong = entries.filter(e => e.passwordStrength === 'Impenetrable' || e.passwordStrength === 'Strong');
    const weak = entries.filter(e => e.passwordStrength === 'Fair');
    const risk = entries.filter(e => e.passwordStrength === 'Weak');

    const totalScore = entries.length > 0
      ? Math.round(entries.reduce((sum, e) => sum + e.strengthScore, 0) / entries.length)
      : 0;

    res.json({
      success: true,
      analysis: {
        overallScore: totalScore,
        strong: strong.length,
        weak: weak.length,
        risk: risk.length,
        entries: entries.map(e => ({
          _id: e._id,
          siteName: e.siteName,
          siteURL: e.siteURL,
          username: decrypt(e.username),
          passwordStrength: e.passwordStrength,
          strengthScore: e.strengthScore,
          favicon: e.favicon,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEntries,
  getEntry,
  revealEntry,
  createEntry,
  updateEntry,
  deleteEntry,
  getSecurityAnalysis,
};
