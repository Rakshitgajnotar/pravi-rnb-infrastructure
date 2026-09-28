import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const PRESET_OFFICIALS = [
  {
    role: 'Admin',
    name: 'Er. Rajesh Patel',
    email: 'admin@rnb.gujarat.gov.in',
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
    return null; // Require explicit login
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('pravi_token') || null;
  });

  const [availableUsers, setAvailableUsers] = useState(PRESET_OFFICIALS);
  const [loading, setLoading] = useState(false);

  // Sync available official demo users on mount
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

  // Login handler
  const login = async (credentials) => {
    try {
      setLoading(true);
      const res = await authService.login(credentials);
      if (res.success && res.data) {
        setCurrentUser(res.data);
        setToken(res.token);
        localStorage.setItem('pravi_user', JSON.stringify(res.data));
        localStorage.setItem('pravi_token', res.token);
        return res;
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      // Local demo fallback if backend is unreachable
      const found = availableUsers.find(
        (u) =>
          u.role === credentials.role ||
          u.email?.toLowerCase() === credentials.email?.toLowerCase()
      ) || PRESET_OFFICIALS[0];

      const demoToken = btoa(
        unescape(
          encodeURIComponent(
            JSON.stringify({
              _id: found._id || 'demo_usr',
              role: found.role,
              name: found.name,
              email: found.email,
            })
          )
        )
      );

      setCurrentUser(found);
      setToken(demoToken);
      localStorage.setItem('pravi_user', JSON.stringify(found));
      localStorage.setItem('pravi_token', demoToken);
      return { success: true, message: `Logged in as ${found.name}`, data: found };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('pravi_user');
    localStorage.removeItem('pravi_token');
  };

  // Switch role handler (when logged in)
  const switchRole = async (targetRole) => {
    try {
      const updated = await authService.switchRole(targetRole);
      const userObj = updated.data || updated;
      setCurrentUser(userObj);
      if (updated.token) {
        setToken(updated.token);
        localStorage.setItem('pravi_token', updated.token);
      }
      localStorage.setItem('pravi_user', JSON.stringify(userObj));
      return userObj;
    } catch (err) {
      const found = availableUsers.find((u) => u.role === targetRole) || PRESET_OFFICIALS.find((u) => u.role === targetRole);
      if (found) {
        const demoToken = btoa(
          unescape(
            encodeURIComponent(
              JSON.stringify({
                _id: found._id || `usr_${found.role.toLowerCase()}`,
                role: found.role,
                name: found.name,
                email: found.email,
              })
            )
          )
        );
        setCurrentUser(found);
        setToken(demoToken);
        localStorage.setItem('pravi_token', demoToken);
        localStorage.setItem('pravi_user', JSON.stringify(found));
        return found;
      }
    }
  };

  const can = (permissionKey) => {
    if (!currentUser || !currentUser.permissions) return false;
    if (currentUser.role === 'Admin') return true;
    return !!currentUser.permissions[permissionKey];
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated: !!currentUser && !!token,
        availableUsers,
        login,
        logout,
        switchRole,
        can,
        isAdmin: currentUser?.role === 'Admin',
        isInspector: currentUser?.role === 'Inspector',
        isContractor: currentUser?.role === 'Contractor',
        isAuditor: currentUser?.role === 'Auditor',
        loading,
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
