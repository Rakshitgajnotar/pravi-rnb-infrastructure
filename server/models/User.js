const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ['Admin', 'Inspector', 'Contractor', 'Auditor'],
        message: '{VALUE} is not a valid R&B system role',
      },
      default: 'Admin',
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    division: {
      type: String,
      required: true,
      trim: true,
    },
    badgeColor: {
      type: String,
      default: 'blue',
    },
    permissions: {
      canCreateAsset: { type: Boolean, default: false },
      canEditAsset: { type: Boolean, default: false },
      canDeleteAsset: { type: Boolean, default: false },
      canInspect: { type: Boolean, default: false },
      canMaintain: { type: Boolean, default: false },
      canExportReports: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
