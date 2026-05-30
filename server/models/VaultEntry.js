const mongoose = require('mongoose');
const { encrypt } = require('../utils/crypto');

const VaultEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    siteName: {
      type: String,
      required: [true, 'Site name is required'],
      trim: true,
    },
    siteURL: {
      type: String,
      required: [true, 'Site URL is required'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    notes: {
      type: String,
      default: '',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    passwordStrength: {
      type: String,
      enum: ['Weak', 'Medium', 'Strong'],
      default: 'Weak',
    },
    strengthScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    favicon: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

VaultEntrySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('VaultEntry', VaultEntrySchema);