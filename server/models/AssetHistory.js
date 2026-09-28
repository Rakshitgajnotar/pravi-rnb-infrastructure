const mongoose = require('mongoose');

const assetHistorySchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset reference is required'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
    },
    previousValue: {
      type: String,
      default: '',
    },
    newValue: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'History event description is required'],
      trim: true,
    },
    performedBy: {
      type: String,
      default: 'System User',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

assetHistorySchema.index({ assetId: 1, createdAt: -1 });

module.exports = mongoose.model('AssetHistory', assetHistorySchema);
