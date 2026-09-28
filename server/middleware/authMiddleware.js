const User = require('../models/User');

// Default fallback admin user for system operations or requests without explicit credentials
const DEFAULT_USER = {
  _id: 'system_admin_001',
  name: 'Er. Rajesh Patel',
  email: 'rajesh.patel@rnb.gujarat.gov.in',
  role: 'Admin',
  designation: 'Executive Engineer (EE)',
  division: 'R&B Gandhinagar State Division',
  permissions: {
    canCreateAsset: true,
    canEditAsset: true,
    canDeleteAsset: true,
    canInspect: true,
    canMaintain: true,
    canExportReports: true,
  },
};

const getDesignation = (role) => {
  switch (role) {
    case 'Admin':
      return 'Executive Engineer (EE)';
    case 'Inspector':
      return 'Assistant Engineer / Field Inspector';
    case 'Contractor':
      return 'Chief Maintenance Contractor';
    case 'Auditor':
      return 'Principal State Auditor';
    default:
      return 'Department Official';
  }
};

const getPermissions = (role) => {
  return {
    canCreateAsset: role === 'Admin',
    canEditAsset: role === 'Admin',
    canDeleteAsset: role === 'Admin',
    canInspect: role === 'Admin' || role === 'Inspector',
    canMaintain: role === 'Admin' || role === 'Contractor',
    canExportReports: true,
  };
};

// Extracts user context from incoming request headers or database
const authenticate = async (req, res, next) => {
  try {
    let role = null;
    let name = null;
    let userId = null;

    // 1. Check standard Authorization header (Bearer token or encoded json)
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      try {
        // Check if token is Base64 encoded JSON
        const decodedStr = Buffer.from(token, 'base64').toString('utf8');
        if (decodedStr.startsWith('{')) {
          const parsed = JSON.parse(decodedStr);
          role = parsed.role;
          name = parsed.name;
          userId = parsed._id || parsed.id;
        } else if (['Admin', 'Inspector', 'Contractor', 'Auditor'].includes(token)) {
          role = token;
        }
      } catch (decodeErr) {
        if (['Admin', 'Inspector', 'Contractor', 'Auditor'].includes(token)) {
          role = token;
        }
      }
    }

    // 2. Check fallback custom headers
    if (!role && req.headers['x-user-role']) {
      role = req.headers['x-user-role'];
    }
    if (!name && req.headers['x-user-name']) {
      name = req.headers['x-user-name'];
    }
    if (!userId && req.headers['x-user-id']) {
      userId = req.headers['x-user-id'];
    }

    // 3. Resolve user in DB or construct identity
    if (userId) {
      try {
        const dbUser = await User.findById(userId);
        if (dbUser) {
          req.user = dbUser;
          return next();
        }
      } catch (e) {
        // ignore
      }
    }

    if (role) {
      // Find matching user by role
      try {
        const dbUser = await User.findOne({ role });
        if (dbUser) {
          req.user = dbUser;
          return next();
        }
      } catch (e) {
        // ignore
      }

      // If user not in DB yet, create dynamic user object
      req.user = {
        _id: userId || `usr_${role.toLowerCase()}`,
        name: name || `Official (${role})`,
        role,
        designation: getDesignation(role),
        division: 'Gujarat R&B Department',
        permissions: getPermissions(role),
      };
      return next();
    }

    // Default to Super Admin for seamless development & backwards compatibility
    req.user = DEFAULT_USER;
    next();
  } catch (err) {
    req.user = DEFAULT_USER;
    next();
  }
};

// Middleware to restrict access to specific roles
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No user context identified.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized to access this resource. Required role(s): ${allowedRoles.join(', ')}.`,
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  DEFAULT_USER,
};
