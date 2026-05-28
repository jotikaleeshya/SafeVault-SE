const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Single Responsibility: User data management
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    masterPassword: {
      type: String,
      required: [true, 'Master password is required'],
      minlength: 8,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    trustedDevices: [
      {
        deviceId: String,
        createdAt: { type: Date, default: Date.now },
        expiresAt: Date,
      },
    ],
    settings: {
      autofill: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// Hash master password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('masterPassword')) return next();
  const salt = await bcrypt.genSalt(12);
  this.masterPassword = await bcrypt.hash(this.masterPassword, salt);
  next();
});

// Method to verify master password
UserSchema.methods.verifyMasterPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.masterPassword);
};

module.exports = mongoose.model('User', UserSchema);
