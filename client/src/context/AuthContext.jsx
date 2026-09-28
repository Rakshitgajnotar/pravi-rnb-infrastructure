import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const PRESET_OFFICIALS = [
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

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('pravi_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return PRESET_OFFICIALS[0]; // Default: Executive Engineer (Admin)
  });

  const [availableUsers, setAvailableUsers] = useState(PRESET_OFFICIALS);

  // Sync with backend available users on mount
  useEffect(() => {
    const initUsers = async () => {
      try {
        const users = await authService.getUsers();
        if (users && users.length > 0) {
          setAvailableUsers(users);
        }
      } catch (err) {
        // use preset fallback
      }
    };
    initUsers();
  }, []);

  const switchRole = async (targetRole) => {
    try {
      const updated = await authService.switchRole(targetRole);
      setCurrentUser(updated);
      localStorage.setItem('pravi_user', JSON.stringify(updated));
      return updated;
    } catch (err) {
      // Offline / local fallback
      const found = availableUsers.find((u) => u.role === targetRole) || PRESET_OFFICIALS.find((u) => u.role === targetRole);
      if (found) {
        setCurrentUser(found);
        localStorage.setItem('pravi_user', JSON.stringify(found));
        return found;
      }
    }
  };

  const can = (permissionKey) => {
    if (!currentUser || !currentUser.permissions) return false;
    // Admins always have all permissions
    if (currentUser.role === 'Admin') return true;
    return !!currentUser.permissions[permissionKey];
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        availableUsers,
        switchRole,
        can,
        isAdmin: currentUser?.role === 'Admin',
        isInspector: currentUser?.role === 'Inspector',
        isContractor: currentUser?.role === 'Contractor',
        isAuditor: currentUser?.role === 'Auditor',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
