const User = require('../models/User');

const PRESET_ROLES = [
  {
    role: 'Admin',
    name: 'Er. Rajesh Patel',
    email: 'rajesh.patel@rnb.gujarat.gov.in',
    designation: 'Executive Engineer (EE)',
    division: 'Gandhinagar State Capital Division',
    badgeColor: 'purple',
    description: 'Full administrative authority: Register assets, edit technical specifications, approve demolitions, allocate budgets.',
    permissions: {
      canCreateAsset: true,
      canEditAsset: true,
      canDeleteAsset: true,
      canInspect: true,
      canMaintain: true,
      canExportReports: true,
    },
  },
  {
    role: 'Inspector',
    name: 'Kavita Mehta',
    email: 'kavita.mehta@rnb.gujarat.gov.in',
    designation: 'Assistant Engineer / Field Inspector',
    division: 'Ahmedabad Circle Quality & Audit Wing',
    badgeColor: 'blue',
    description: 'Field inspection operations: Log structural observations, grade condition (Critical/Poor/Fair/Good/Excellent), recommend repairs.',
    permissions: {
      canCreateAsset: false,
      canEditAsset: false,
      canDeleteAsset: false,
      canInspect: true,
      canMaintain: false,
      canExportReports: true,
    },
  },
  {
    role: 'Contractor',
    name: 'Suresh Prajapati',
    email: 'suresh.prajapati@gujarat-infra.co.in',
    designation: 'Chief Maintenance Contractor',
    division: 'Western Zone Works & Resurfacing Division',
    badgeColor: 'amber',
    description: 'Work order execution: Update maintenance progress, record actual costs, register repair completion dates.',
    permissions: {
      canCreateAsset: false,
      canEditAsset: false,
      canDeleteAsset: false,
      canInspect: false,
      canMaintain: true,
      canExportReports: true,
    },
  },
  {
    role: 'Auditor',
    name: 'Dr. Arvind Dave',
    email: 'arvind.dave@audit.gujarat.gov.in',
    designation: 'Principal State Auditor',
    division: 'Directorate of Infrastructure Accounts & Vigilance',
    badgeColor: 'emerald',
    description: 'Read-only financial and lifecycle oversight: Generate reports, analyze expenditure audits, review historical timelines.',
    permissions: {
      canCreateAsset: false,
      canEditAsset: false,
      canDeleteAsset: false,
      canInspect: false,
      canMaintain: false,
      canExportReports: true,
    },
  },
];

// @desc    Get all available official roles and seeded demo users
// @route   GET /api/auth/users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    let users = await User.find().sort({ role: 1 });
    if (!users || users.length === 0) {
      // Seed preset roles if not in DB yet
      users = await User.insertMany(PRESET_ROLES);
    }
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Public
const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Quick-switch user profile by role
// @route   POST /api/auth/switch
// @access  Public
const switchRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    let user = await User.findOne({ role });
    if (!user) {
      const preset = PRESET_ROLES.find((p) => p.role === role);
      if (preset) {
        user = await User.create(preset);
      } else {
        return res.status(400).json({
          success: false,
          message: `Unknown role: ${role}`,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Switched active role to ${user.name} (${user.designation})`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getCurrentUser,
  switchRole,
  PRESET_ROLES,
};
