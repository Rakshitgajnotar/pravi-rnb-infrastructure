const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: [true, 'Asset ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    assetName: {
      type: String,
      required: [true, 'Asset Name is required'],
      trim: true,
      minlength: [2, 'Asset Name must be at least 2 characters'],
      maxlength: [180, 'Asset Name cannot exceed 180 characters'],
    },
    assetType: {
      type: String,
      required: [true, 'Asset Type is required'],
      trim: true,
      enum: {
        values: [
          'Road',
          'Bridge',
          'Flyover',
          'Culvert',
          'Government Building',
          'Government Office',
          'Other Infrastructure',
        ],
        message: '{VALUE} is not a valid R&B asset type',
      },
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    taluka: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Under Construction', 'Active', 'Under Maintenance', 'Closed', 'Retired'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Active',
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: {
        values: ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'],
        message: '{VALUE} is not a valid condition',
      },
      default: 'Good',
    },
    ownership: {
      type: String,
      default: 'Government',
      trim: true,
    },
    constructionYear: {
      type: Number,
      min: [1800, 'Construction year is too far in the past'],
      max: [new Date().getFullYear() + 10, 'Construction year cannot exceed next decade'],
      default: null,
    },
    lastInspectionDate: {
      type: Date,
      default: null,
    },
    lastMaintenanceDate: {
      type: Date,
      default: null,
    },
    estimatedCost: {
      type: Number,
      default: 0,
      min: [0, 'Estimated cost cannot be negative'],
    },

    // Road specific fields
    roadLength: {
      type: Number,
      default: null, // in km
    },
    roadWidth: {
      type: Number,
      default: null, // in meters
    },
    surfaceType: {
      type: String,
      default: '',
      trim: true,
    },

    // Bridge specific fields
    bridgeLength: {
      type: Number,
      default: null, // in meters
    },
    bridgeWidth: {
      type: Number,
      default: null, // in meters
    },
    bridgeType: {
      type: String,
      default: '',
      trim: true,
    },

    // Flyover specific fields
    flyoverLength: {
      type: Number,
      default: null, // in meters
    },
    numberOfLanes: {
      type: Number,
      default: null,
    },

    // Building specific fields
    builtUpArea: {
      type: Number,
      default: null, // in sq. meters / sq. ft
    },
    numberOfFloors: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Performance Indexes
assetSchema.index({ assetType: 1 });
assetSchema.index({ district: 1 });
assetSchema.index({ status: 1 });
assetSchema.index({ condition: 1 });
assetSchema.index({ constructionYear: 1 });
assetSchema.index({
  assetName: 'text',
  assetId: 'text',
  district: 'text',
  location: 'text',
});

module.exports = mongoose.model('Asset', assetSchema);
