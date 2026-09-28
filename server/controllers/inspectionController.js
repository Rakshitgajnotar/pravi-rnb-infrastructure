const Inspection = require('../models/Inspection');
const Asset = require('../models/Asset');
const AssetHistory = require('../models/AssetHistory');
const mongoose = require('mongoose');

// Helper to resolve asset by _id or assetId
const resolveAsset = async (idOrCode) => {
  if (mongoose.Types.ObjectId.isValid(idOrCode)) {
    const asset = await Asset.findById(idOrCode);
    if (asset) return asset;
  }
  return await Asset.findOne({ assetId: idOrCode.toUpperCase() });
};

// @desc    Get all inspection reports for an infrastructure asset
// @route   GET /api/assets/:id/inspections
// @access  Public
const getInspectionsByAsset = async (req, res, next) => {
  try {
    const asset = await resolveAsset(req.params.id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: `Asset not found with identifier: ${req.params.id}`,
      });
    }

    const inspections = await Inspection.find({ assetId: asset._id }).sort({ inspectionDate: -1 });

    res.status(200).json({
      success: true,
      count: inspections.length,
      data: inspections,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Record a new field inspection for an infrastructure asset
// @route   POST /api/assets/:id/inspections
// @access  Public
const createInspection = async (req, res, next) => {
  try {
    const asset = await resolveAsset(req.params.id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: `Asset not found with identifier: ${req.params.id}`,
      });
    }

    const {
      inspectionDate = new Date(),
      inspectorName = 'R&B Field Officer',
      condition,
      remarks,
      recommendation = '',
    } = req.body;

    if (!condition) {
      return res.status(400).json({
        success: false,
        message: 'Observed condition is required',
      });
    }

    if (!remarks || !remarks.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Inspection observations and remarks are required',
      });
    }

    const effectiveInspector = inspectorName?.trim() || req.user?.name || 'Field Inspector';
    const actor = req.user ? `${req.user.name} (${req.user.designation || req.user.role})` : effectiveInspector;

    const newInspection = await Inspection.create({
      assetId: asset._id,
      inspectionDate: new Date(inspectionDate),
      inspectorName: effectiveInspector,
      condition,
      remarks: remarks.trim(),
      recommendation: recommendation.trim(),
    });

    // Update the Asset's current condition and lastInspectionDate
    const prevCondition = asset.condition;
    asset.condition = condition;
    asset.lastInspectionDate = newInspection.inspectionDate;
    await asset.save();

    // Record in Asset Lifecycle History / Audit Trail
    await AssetHistory.create({
      assetId: asset._id,
      action: 'Inspection Added',
      previousValue: prevCondition,
      newValue: condition,
      description: `Inspection conducted by ${effectiveInspector}. Condition assessed as ${condition}. Remarks: ${remarks.trim()}`,
      performedBy: actor,
    });

    res.status(201).json({
      success: true,
      message: 'Field inspection recorded successfully and asset condition updated',
      data: newInspection,
      asset: {
        assetId: asset.assetId,
        condition: asset.condition,
        lastInspectionDate: asset.lastInspectionDate,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getInspectionsByAsset,
  createInspection,
};
