import React from 'react';
import {
  Shield,
  UserCheck,
  Check,
  X,
  Building2,
  HardHat,
  Search,
  Eye,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function RoleSwitcherModal({ isOpen, onClose, onRoleChanged }) {
  const { currentUser, availableUsers, switchRole } = useAuth();

  if (!isOpen) return null;

  const handleSelectRole = async (roleName) => {
    await switchRole(roleName);
    if (onRoleChanged) onRoleChanged(roleName);
    onClose();
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <Shield className="w-5 h-5 text-purple-600" />;
      case 'Inspector':
        return <Search className="w-5 h-5 text-blue-600" />;
      case 'Contractor':
        return <HardHat className="w-5 h-5 text-amber-600" />;
      case 'Auditor':
        return <Eye className="w-5 h-5 text-emerald-600" />;
      default:
        return <Building2 className="w-5 h-5 text-slate-600" />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Inspector':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contractor':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Auditor':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <UserCheck className="w-5 h-5 text-brand-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                Switch Official Department Role (RBAC)
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Simulate different government Roads & Buildings authority personas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Select Active Official Persona:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {availableUsers.map((user) => {
              const isActive = currentUser?.role === user.role;
              return (
                <div
                  key={user.role}
                  onClick={() => handleSelectRole(user.role)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                    isActive
                      ? 'border-brand-600 bg-brand-50/40 shadow-md ring-2 ring-brand-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-sm'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-3.5 right-3.5 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900">{user.name}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-600 mt-0.5">
                        {user.designation}
                      </div>
                      <span
                        className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border ${getRoleBadgeClass(
                          user.role
                        )}`}
                      >
                        Role: {user.role}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-100 leading-relaxed">
                    {user.description}
                  </p>

                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {user.permissions?.canCreateAsset && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">
                        + Create Asset
                      </span>
                    )}
                    {user.permissions?.canDeleteAsset && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">
                        + Delete Asset
                      </span>
                    )}
                    {user.permissions?.canInspect && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                        + Log Inspections
                      </span>
                    )}
                    {user.permissions?.canMaintain && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                        + Update Maintenance
                      </span>
                    )}
                    {user.permissions?.canExportReports && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        + Reports Export
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Role permissions are enforced on both frontend UI & MongoDB backend</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
