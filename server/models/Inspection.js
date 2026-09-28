const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset reference is required'],
    },
    inspectionDate: {
      type: Date,
      required: [true, 'Inspection date is required'],
      default: Date.now,
    },
    inspectorName: {
      type: String,
      required: [true, 'Inspector name/officer is required'],
      trim: true,
      default: 'R&B Field Officer',
    },
    condition: {
      type: String,
      required: [true, 'Observed condition is required'],
      enum: {
        values: ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'],
        message: '{VALUE} is not a valid condition',
      },
    },
    remarks: {
      type: String,
      required: [true, 'Inspection observations/remarks are required'],
      trim: true,
    },
    recommendation: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

inspectionSchema.index({ assetId: 1, inspectionDate: -1 });

module.exports = mongoose.model('Inspection', inspectionSchema);
