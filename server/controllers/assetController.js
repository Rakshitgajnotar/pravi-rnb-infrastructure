const Asset = require('../models/Asset');
const Inspection = require('../models/Inspection');
const Maintenance = require('../models/Maintenance');
const AssetHistory = require('../models/AssetHistory');
const seedDatabase = require('../seed/seed');
const mongoose = require('mongoose');

// Helper to find asset by Mongo _id or custom assetId (e.g. R&B-ROAD-001)
const findAssetByIdOrCode = async (idOrCode) => {
  if (mongoose.Types.ObjectId.isValid(idOrCode)) {
    const asset = await Asset.findById(idOrCode);
    if (asset) return asset;
  }
  return await Asset.findOne({ assetId: idOrCode.toUpperCase() });
};

// @desc    Get all assets with search, advanced filtering, sorting, pagination
// @route   GET /api/assets
// @access  Public
const getAssets = async (req, res, next) => {
  try {
    const {
      search = '',
      assetType = '',
      district = '',
      taluka = '',
      status = '',
      condition = '',
      constructionYear = '',
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // 1. Debounced Text Search across assetId, assetName, district, location, taluka
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { assetId: searchRegex },
        { assetName: searchRegex },
        { district: searchRegex },
        { taluka: searchRegex },
        { location: searchRegex },
      ];
    }

    // 2. Exact/Enum Filters
    if (assetType && assetType !== 'All') {
      query.assetType = assetType;
    }

    if (district && district !== 'All') {
      query.district = district;
    }

    if (taluka && taluka !== 'All') {
      query.taluka = taluka;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    if (constructionYear && constructionYear !== 'All') {
      query.constructionYear = parseInt(constructionYear, 10);
    }

    // 3. Sorting
    const sortField = sortBy;
    const sortDirection = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortDirection };

    // 4. Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 20;
    const skip = (pageNum - 1) * limitNum;

    const [total, assets] = await Promise.all([
      Asset.countDocuments(query),
      Asset.find(query).sort(sortOptions).skip(skip).limit(limitNum),
    ]);

    res.status(200).json({
      success: true,
      count: assets.length,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: assets,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single asset profile by ID with linked inspections, maintenance & history
// @route   GET /api/assets/:id
// @access  Public
const getAssetById = async (req, res, next) => {
  try {
    const asset = await findAssetByIdOrCode(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: `R&B Infrastructure Asset not found with identifier: ${req.params.id}`,
      });
    }

    // Fetch linked records in parallel
    const [inspections, maintenance, history] = await Promise.all([
      Inspection.find({ assetId: asset._id }).sort({ inspectionDate: -1 }),
      Maintenance.find({ assetId: asset._id }).sort({ maintenanceDate: -1 }),
      AssetHistory.find({ assetId: asset._id }).sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...asset.toObject(),
        inspections,
        maintenance,
        history,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Register a new R&B infrastructure asset
// @route   POST /api/assets
// @access  Public
const createAsset = async (req, res, next) => {
  try {
    let {
      assetId,
      assetName,
      assetType,
      description,
      district,
      taluka,
      location,
      address,
      latitude,
      longitude,
      status = 'Active',
      condition = 'Good',
      ownership = 'Government',
      constructionYear,
      estimatedCost,
      roadLength,
      roadWidth,
      surfaceType,
      bridgeLength,
      bridgeWidth,
      bridgeType,
      flyoverLength,
      numberOfLanes,
      builtUpArea,
      numberOfFloors,
    } = req.body;

    // Auto-generate Asset ID if not provided based on assetType
    if (!assetId || !assetId.trim()) {
      const typePrefixMap = {
        Road: 'R&B-ROAD',
        Bridge: 'R&B-BRG',
        Flyover: 'R&B-FLY',
        Culvert: 'R&B-CUL',
        'Government Building': 'R&B-BLD',
        'Government Office': 'R&B-OFF',
        'Other Infrastructure': 'R&B-INF',
      };
      const prefix = typePrefixMap[assetType] || 'R&B-AST';
      const count = await Asset.countDocuments({ assetType });
      const nextNum = (count + 1).toString().padStart(3, '0');
      assetId = `${prefix}-${nextNum}`;
    } else {
      assetId = assetId.trim().toUpperCase();
    }

    // Verify uniqueness
    const existing = await Asset.findOne({ assetId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Asset ID "${assetId}" is already registered. Please provide a unique Asset ID.`,
      });
    }

    const newAsset = await Asset.create({
      assetId,
      assetName: assetName?.trim(),
      assetType,
      description: description?.trim() || '',
      district: district?.trim(),
      taluka: taluka?.trim() || '',
      location: location?.trim(),
      address: address?.trim() || '',
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      status,
      condition,
      ownership: ownership?.trim() || 'Government',
      constructionYear: constructionYear ? Number(constructionYear) : null,
      estimatedCost: estimatedCost ? Number(estimatedCost) : 0,
      roadLength: roadLength ? Number(roadLength) : null,
      roadWidth: roadWidth ? Number(roadWidth) : null,
      surfaceType: surfaceType?.trim() || '',
      bridgeLength: bridgeLength ? Number(bridgeLength) : null,
      bridgeWidth: bridgeWidth ? Number(bridgeWidth) : null,
      bridgeType: bridgeType?.trim() || '',
      flyoverLength: flyoverLength ? Number(flyoverLength) : null,
      numberOfLanes: numberOfLanes ? Number(numberOfLanes) : null,
      builtUpArea: builtUpArea ? Number(builtUpArea) : null,
      numberOfFloors: numberOfFloors ? Number(numberOfFloors) : null,
    });

    const actor = req.user ? `${req.user.name} (${req.user.designation || req.user.role})` : 'System User';

    // Automatically record lifecycle creation event in AssetHistory
    await AssetHistory.create({
      assetId: newAsset._id,
      action: 'Asset Registered',
      previousValue: '',
      newValue: newAsset.status,
      description: `Asset "${newAsset.assetName}" (${newAsset.assetId}) registered in R&B inventory.`,
      performedBy: actor,
    });

    res.status(201).json({
      success: true,
      message: 'Infrastructure asset registered successfully',
      data: newAsset,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update R&B infrastructure asset
// @route   PUT /api/assets/:id
// @access  Public
const updateAsset = async (req, res, next) => {
  try {
    const existingAsset = await findAssetByIdOrCode(req.params.id);

    if (!existingAsset) {
      return res.status(404).json({
        success: false,
        message: `Asset not found with identifier: ${req.params.id}`,
      });
    }

    // If changing assetId, verify uniqueness
    if (req.body.assetId && req.body.assetId.toUpperCase() !== existingAsset.assetId) {
      const duplicate = await Asset.findOne({
        assetId: req.body.assetId.toUpperCase(),
        _id: { $ne: existingAsset._id },
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Asset ID "${req.body.assetId.toUpperCase()}" already exists.`,
        });
      }
    }

    const prevStatus = existingAsset.status;
    const prevCondition = existingAsset.condition;

    // Updatable fields
    const fields = [
      'assetId',
      'assetName',
      'assetType',
      'description',
      'district',
      'taluka',
      'location',
      'address',
      'latitude',
      'longitude',
      'status',
      'condition',
      'ownership',
      'constructionYear',
      'estimatedCost',
      'roadLength',
      'roadWidth',
      'surfaceType',
      'bridgeLength',
      'bridgeWidth',
      'bridgeType',
      'flyoverLength',
      'numberOfLanes',
      'builtUpArea',
      'numberOfFloors',
      'lastInspectionDate',
      'lastMaintenanceDate',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'assetId') {
          existingAsset.assetId = req.body.assetId.trim().toUpperCase();
        } else if (typeof req.body[field] === 'string') {
          existingAsset[field] = req.body[field].trim();
        } else {
          existingAsset[field] = req.body[field];
        }
      }
    });

    const updatedAsset = await existingAsset.save();

    const actor = req.user ? `${req.user.name} (${req.user.designation || req.user.role})` : 'System User';

    // Auto-create history audit entries if status or condition changed
    if (req.body.status && req.body.status !== prevStatus) {
      await AssetHistory.create({
        assetId: updatedAsset._id,
        action: 'Status Changed',
        previousValue: prevStatus,
        newValue: updatedAsset.status,
        description: `Operational status transitioned from ${prevStatus} to ${updatedAsset.status}.`,
        performedBy: actor,
      });
    }

    if (req.body.condition && req.body.condition !== prevCondition) {
      await AssetHistory.create({
        assetId: updatedAsset._id,
        action: 'Condition Changed',
        previousValue: prevCondition,
        newValue: updatedAsset.condition,
        description: `Infrastructure condition assessed from ${prevCondition} to ${updatedAsset.condition}.`,
        performedBy: actor,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Asset updated successfully',
      data: updatedAsset,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete an asset and its linked inspections, maintenance, and history
// @route   DELETE /api/assets/:id
// @access  Public
const deleteAsset = async (req, res, next) => {
  try {
    const asset = await findAssetByIdOrCode(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: `Asset not found with identifier: ${req.params.id}`,
      });
    }

    await Promise.all([
      Asset.findByIdAndDelete(asset._id),
      Inspection.deleteMany({ assetId: asset._id }),
      Maintenance.deleteMany({ assetId: asset._id }),
      AssetHistory.deleteMany({ assetId: asset._id }),
    ]);

    res.status(200).json({
      success: true,
      message: `Asset "${asset.assetName}" (${asset.assetId}) and its lifecycle records deleted successfully.`,
      data: { id: asset._id, assetId: asset.assetId },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get comprehensive government R&B dashboard statistics & Recharts analytics
// @route   GET /api/assets/stats
// @access  Public
const getAssetStats = async (req, res, next) => {
  try {
    const [
      totalAssets,
      activeAssets,
      maintenanceAssets,
      constructionAssets,
      closedAssets,
      poorConditionAssets,
      criticalConditionAssets,
      typeCounts,
      statusCounts,
      conditionCounts,
      districtCounts,
      maintenanceSummary,
      recentlyAdded,
    ] = await Promise.all([
      Asset.countDocuments(),
      Asset.countDocuments({ status: 'Active' }),
      Asset.countDocuments({ status: 'Under Maintenance' }),
      Asset.countDocuments({ status: 'Under Construction' }),
      Asset.countDocuments({ status: { $in: ['Closed', 'Retired'] } }),
      Asset.countDocuments({ condition: 'Poor' }),
      Asset.countDocuments({ condition: 'Critical' }),
      Asset.aggregate([{ $group: { _id: '$assetType', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Asset.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Asset.aggregate([{ $group: { _id: '$condition', count: { $sum: 1 } } }]),
      Asset.aggregate([{ $group: { _id: '$district', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Maintenance.aggregate([{ $group: { _id: '$status', count: { $sum: 1 }, totalCost: { $sum: '$estimatedCost' } } }]),
      Asset.find().sort({ createdAt: -1 }).limit(6),
    ]);

    // Format chart distributions for Recharts
    const assetsByType = typeCounts.map((t) => ({
      name: t._id,
      count: t.count,
    }));

    // Status distribution with consistent color codes
    const statusColors = {
      Active: '#10b981', // emerald
      'Under Maintenance': '#f59e0b', // amber
      'Under Construction': '#6366f1', // indigo
      Closed: '#64748b', // slate
      Retired: '#475569', // slate
    };
    const assetsByStatus = statusCounts.map((s) => ({
      name: s._id,
      value: s.count,
      color: statusColors[s._id] || '#94a3b8',
    }));

    // Condition distribution with standard government color codes
    const conditionColors = {
      Excellent: '#10b981', // green
      Good: '#3b82f6', // blue
      Fair: '#f59e0b', // amber
      Poor: '#f97316', // orange
      Critical: '#ef4444', // red
    };
    const assetsByCondition = conditionCounts.map((c) => ({
      name: c._id,
      count: c.count,
      color: conditionColors[c._id] || '#64748b',
    }));

    // District distribution
    const assetsByDistrict = districtCounts.map((d) => ({
      district: d._id,
      count: d.count,
    }));

    // Assets Requiring Attention
    const assetsRequiringAttention = await Asset.countDocuments({
      $or: [
        { condition: { $in: ['Poor', 'Critical'] } },
        { status: 'Under Maintenance' },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalAssets,
          activeAssets,
          maintenanceAssets,
          constructionAssets,
          closedAssets,
          poorConditionAssets,
          criticalConditionAssets,
          assetsRequiringAttention,
          activePercentage: totalAssets > 0 ? Math.round((activeAssets / totalAssets) * 100) : 0,
        },
        assetsByType,
        typeBreakdown: assetsByType.map((t) => ({ name: t.type, count: t.count })),
        assetsByStatus,
        statusBreakdown: assetsByStatus,
        assetsByCondition,
        conditionBreakdown: assetsByCondition,
        assetsByDistrict,
        districtBreakdown: assetsByDistrict,
        maintenanceSummary,
        recentlyAdded,
        recentAssets: recentlyAdded,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Seed demo R&B infrastructure data
// @route   POST /api/assets/seed
// @access  Public
const seedDemoData = async (req, res, next) => {
  try {
    const counts = await seedDatabase();
    res.status(200).json({
      success: true,
      message: `Database successfully reseeded with ${counts.assetsCount} R&B Infrastructure Assets, ${counts.inspectionsCount} Inspections, ${counts.maintenanceCount} Maintenance Ops, and ${counts.historyCount} Audit Trail Events.`,
      data: counts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetStats,
  seedDemoData,
};
