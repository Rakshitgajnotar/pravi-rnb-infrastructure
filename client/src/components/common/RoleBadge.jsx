import React from 'react';
import { Shield, Search, HardHat, Eye } from 'lucide-react';

export default function RoleBadge({ role, size = 'md' }) {
  const getRoleConfig = (r) => {
    switch (r) {
      case 'Admin':
        return {
          label: 'Executive Engineer (Admin)',
          shortLabel: 'Admin',
          icon: Shield,
          styles: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20',
        };
      case 'Inspector':
        return {
          label: 'Field Inspector',
          shortLabel: 'Inspector',
          icon: Search,
          styles: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
        };
      case 'Contractor':
        return {
          label: 'Maintenance Contractor',
          shortLabel: 'Contractor',
          icon: HardHat,
          styles: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
        };
      case 'Auditor':
        return {
          label: 'Department Auditor',
          shortLabel: 'Auditor',
          icon: Eye,
          styles: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
        };
      default:
        return {
          label: r || 'Official',
          shortLabel: r || 'Official',
          icon: Shield,
          styles: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-1',
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }[size] || 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-bold rounded-lg border shadow-sm ${config.styles} ${sizeClasses}`}
    >
      <Icon className="w-3 h-3 flex-shrink-0" />
      <span>{size === 'xs' || size === 'sm' ? config.shortLabel : config.label}</span>
    </span>
  );
}
