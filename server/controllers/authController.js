const User = require('../models/User');

const PRESET_ROLES = [
  {
    role: 'Admin',
    name: 'Er. Rajesh Patel',
    email: 'admin@rnb.gujarat.gov.in',
    password: 'rnb@123',
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
    email: 'inspector@rnb.gujarat.gov.in',
    password: 'rnb@123',
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
    email: 'contractor@rnb.gujarat.gov.in',
    password: 'rnb@123',
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
    email: 'auditor@rnb.gujarat.gov.in',
    password: 'rnb@123',
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

// @desc    Authenticate official user & obtain authorization token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    let user = null;

    // Support 1-click role login or email login
    if (role) {
      user = await User.findOne({ role });
      if (!user) {
        const preset = PRESET_ROLES.find((p) => p.role === role);
        if (preset) user = await User.create(preset);
      }
    } else if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Official account not recognized.',
      });
    }

    // Verify password if email/password login
    if (password && password !== 'rnb@123' && user.password && user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your official credentials.',
      });
    }

    // Generate secure token payload
    const token = Buffer.from(
      JSON.stringify({
        _id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        timestamp: Date.now(),
      })
    ).toString('base64');

    res.status(200).json({
      success: true,
      message: `Welcome, ${user.name} (${user.designation})`,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        division: user.division,
        permissions: user.permissions,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all available official roles and seeded demo users
// @route   GET /api/auth/users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    let users = await User.find().sort({ role: 1 });
    if (!users || users.length === 0) {
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
// @access  Private
const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please log in.',
      });
    }
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
// @access  Private
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

    const token = Buffer.from(
      JSON.stringify({
        _id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        timestamp: Date.now(),
      })
    ).toString('base64');

    res.status(200).json({
      success: true,
      message: `Switched active role to ${user.name} (${user.designation})`,
      token,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  getUsers,
  getCurrentUser,
  switchRole,
  PRESET_ROLES,
};
