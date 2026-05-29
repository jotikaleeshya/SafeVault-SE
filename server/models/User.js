const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

UserSchema.pre('save', async function (next) {
  if (!this.isModified('masterPassword')) return next();
  this.masterPassword = await bcrypt.hash(this.masterPassword, 12);
  next();
});

UserSchema.methods.verifyMasterPassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.masterPassword);
};

// Alias used by authRoutes2
UserSchema.methods.verifyPassword = UserSchema.methods.verifyMasterPassword;

module.exports = mongoose.model('User', UserSchema);
