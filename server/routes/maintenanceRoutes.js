const express = require('express');
const router = express.Router();
const {
  getAllMaintenance,
  updateMaintenance,
} = require('../controllers/maintenanceController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

// List maintenance (accessible by all roles)
router.route('/')
  .get(getAllMaintenance);

// Update maintenance / complete work orders (Admin & Contractor)
router.route('/:id')
  .put(authorize('Admin', 'Contractor'), updateMaintenance);

module.exports = router;
