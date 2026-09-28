const express = require('express');
const router = express.Router();
const {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetStats,
  seedDemoData,
} = require('../controllers/assetController');
const {
  getInspectionsByAsset,
  createInspection,
} = require('../controllers/inspectionController');
const {
  getMaintenanceByAsset,
  createMaintenance,
} = require('../controllers/maintenanceController');
const {
  getHistoryByAsset,
} = require('../controllers/historyController');
const { validateAsset } = require('../middleware/validateAsset');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Attach user context to all asset requests
router.use(authenticate);

// Analytics & Statistics (accessible by all roles)
router.get('/stats', getAssetStats);

// Re-seed R&B demo records (admin only)
router.post('/seed', authorize('Admin'), seedDemoData);

// Core Asset CRUD
router.route('/')
  .get(getAssets)
  .post(authorize('Admin'), validateAsset, createAsset);

router.route('/:id')
  .get(getAssetById)
  .put(authorize('Admin', 'Inspector'), validateAsset, updateAsset)
  .delete(authorize('Admin'), deleteAsset);

// Linked Inspections (Field audit: Admin & Inspector)
router.route('/:id/inspections')
  .get(getInspectionsByAsset)
  .post(authorize('Admin', 'Inspector'), createInspection);

// Linked Maintenance (Work orders: Admin & Contractor)
router.route('/:id/maintenance')
  .get(getMaintenanceByAsset)
  .post(authorize('Admin', 'Contractor'), createMaintenance);

// Linked Lifecycle Audit History (read-only for all roles)
router.route('/:id/history')
  .get(getHistoryByAsset);

module.exports = router;
