const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset reference is required'],
    },
    maintenanceDate: {
      type: Date,
      required: [true, 'Maintenance date is required'],
      default: Date.now,
    },
    maintenanceType: {
      type: String,
      required: [true, 'Maintenance type is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Maintenance scope/description is required'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Planned', 'In Progress', 'Completed'],
        message: '{VALUE} is not a valid maintenance status',
      },
      default: 'Planned',
    },
    estimatedCost: {
      type: Number,
      default: 0,
      min: [0, 'Estimated cost cannot be negative'],
    },
    actualCost: {
      type: Number,
      default: 0,
      min: [0, 'Actual cost cannot be negative'],
    },
    contractor: {
      type: String,
      trim: true,
      default: '',
    },
    completionDate: {
      type: Date,
      default: null,
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

maintenanceSchema.index({ assetId: 1, maintenanceDate: -1 });
maintenanceSchema.index({ status: 1 });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
