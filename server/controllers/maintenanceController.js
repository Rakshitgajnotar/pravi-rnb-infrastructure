const Maintenance = require('../models/Maintenance');
const Asset = require('../models/Asset');
const AssetHistory = require('../models/AssetHistory');
const mongoose = require('mongoose');

const resolveAsset = async (idOrCode) => {
  if (mongoose.Types.ObjectId.isValid(idOrCode)) {
    const asset = await Asset.findById(idOrCode);
    if (asset) return asset;
  }
  return await Asset.findOne({ assetId: idOrCode.toUpperCase() });
};

// @desc    Get all maintenance records across all infrastructure assets (with optional status filter)
// @route   GET /api/maintenance
// @access  Public
const getAllMaintenance = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }

    const records = await Maintenance.find(filter)
      .populate('assetId', 'assetId assetName assetType district location condition status')
      .sort({ maintenanceDate: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all maintenance records for a specific asset
// @route   GET /api/assets/:id/maintenance
// @access  Public
const getMaintenanceByAsset = async (req, res, next) => {
  try {
    const asset = await resolveAsset(req.params.id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: `Asset not found with identifier: ${req.params.id}`,
      });
    }

    const records = await Maintenance.find({ assetId: asset._id }).sort({ maintenanceDate: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Schedule/create a new maintenance operation for an asset
// @route   POST /api/assets/:id/maintenance
// @access  Public
const createMaintenance = async (req, res, next) => {
  try {
    const asset = await resolveAsset(req.params.id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: `Asset not found with identifier: ${req.params.id}`,
      });
    }

    const {
      maintenanceDate = new Date(),
      maintenanceType,
      description,
      status = 'Planned',
      estimatedCost = 0,
      contractor = '',
      remarks = '',
    } = req.body;

    if (!maintenanceType || !maintenanceType.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Maintenance type is required',
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Description/scope of maintenance work is required',
      });
    }

    const newMaintenance = await Maintenance.create({
      assetId: asset._id,
      maintenanceDate: new Date(maintenanceDate),
      maintenanceType: maintenanceType.trim(),
      description: description.trim(),
      status,
      estimatedCost: Number(estimatedCost) || 0,
      actualCost: 0,
      contractor: contractor.trim(),
      remarks: remarks.trim(),
    });

    // If status is 'In Progress', automatically update the Asset's status to 'Under Maintenance'
    const prevStatus = asset.status;
    if (status === 'In Progress') {
      asset.status = 'Under Maintenance';
      asset.lastMaintenanceDate = newMaintenance.maintenanceDate;
      await asset.save();

      const actor = req.user ? `${req.user.name} (${req.user.designation || req.user.role})` : 'System User';

      await AssetHistory.create({
        assetId: asset._id,
        action: 'Maintenance Started',
        previousValue: prevStatus,
        newValue: 'Under Maintenance',
        description: `Maintenance operation "${maintenanceType.trim()}" started by ${contractor || 'contractor'}. Asset status set to Under Maintenance.`,
        performedBy: actor,
      });
    } else {
      const actor = req.user ? `${req.user.name} (${req.user.designation || req.user.role})` : 'System User';

      await AssetHistory.create({
        assetId: asset._id,
        action: 'Maintenance Scheduled',
        previousValue: '',
        newValue: status,
        description: `Maintenance operation "${maintenanceType.trim()}" scheduled with estimated cost ₹${Number(estimatedCost).toLocaleString()}.`,
        performedBy: actor,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Maintenance operation created successfully',
      data: newMaintenance,
      asset: {
        assetId: asset.assetId,
        status: asset.status,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update maintenance record status (e.g. In Progress or Completed)
// @route   PUT /api/maintenance/:id
// @access  Public
const updateMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);
    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: `Maintenance record not found with ID: ${req.params.id}`,
      });
    }

    const asset = await Asset.findById(maintenance.assetId);
    const prevMaintStatus = maintenance.status;

    const {
      status,
      actualCost,
      completionDate,
      remarks,
      contractor,
      improvedCondition, // optional updated condition upon completion (e.g. Good or Excellent)
    } = req.body;

    if (status) maintenance.status = status;
    if (actualCost !== undefined) maintenance.actualCost = Number(actualCost) || 0;
    if (remarks) maintenance.remarks = remarks.trim();
    if (contractor) maintenance.contractor = contractor.trim();

    if (status === 'Completed') {
      maintenance.completionDate = completionDate ? new Date(completionDate) : new Date();

      if (asset) {
        const prevAssetStatus = asset.status;
        const prevAssetCondition = asset.condition;

        // Restore asset status to Active
        asset.status = 'Active';
        asset.lastMaintenanceDate = maintenance.completionDate;

        if (improvedCondition) {
          asset.condition = improvedCondition;
        }

        await asset.save();

        const actor = req.user ? `${req.user.name} (${req.user.designation || req.user.role})` : 'System User';

        await AssetHistory.create({
          assetId: asset._id,
          action: 'Maintenance Completed',
          previousValue: prevAssetStatus,
          newValue: 'Active',
          description: `Maintenance "${maintenance.maintenanceType}" completed. Status returned to Active.${
            improvedCondition ? ` Condition restored to ${improvedCondition}.` : ''
          }`,
          performedBy: actor,
        });
      }
    } else if (status === 'In Progress' && asset && asset.status !== 'Under Maintenance') {
      const prevAssetStatus = asset.status;
      asset.status = 'Under Maintenance';
      await asset.save();

      const actor = req.user ? `${req.user.name} (${req.user.designation || req.user.role})` : 'System User';

      await AssetHistory.create({
        assetId: asset._id,
        action: 'Maintenance Started',
        previousValue: prevAssetStatus,
        newValue: 'Under Maintenance',
        description: `Maintenance operation "${maintenance.maintenanceType}" status updated to In Progress.`,
        performedBy: actor,
      });
    }

    await maintenance.save();

    res.status(200).json({
      success: true,
      message: 'Maintenance record updated successfully',
      data: maintenance,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllMaintenance,
  getMaintenanceByAsset,
  createMaintenance,
  updateMaintenance,
};
