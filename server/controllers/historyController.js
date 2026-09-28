const AssetHistory = require('../models/AssetHistory');
const Asset = require('../models/Asset');
const mongoose = require('mongoose');

const resolveAsset = async (idOrCode) => {
  if (mongoose.Types.ObjectId.isValid(idOrCode)) {
    const asset = await Asset.findById(idOrCode);
    if (asset) return asset;
  }
  return await Asset.findOne({ assetId: idOrCode.toUpperCase() });
};

// @desc    Get complete lifecycle audit trail / history for an asset
// @route   GET /api/assets/:id/history
// @access  Public
const getHistoryByAsset = async (req, res, next) => {
  try {
    const asset = await resolveAsset(req.params.id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: `Asset not found with identifier: ${req.params.id}`,
      });
    }

    const history = await AssetHistory.find({ assetId: asset._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHistoryByAsset,
};
