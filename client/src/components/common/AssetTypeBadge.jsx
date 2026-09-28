import React from 'react';
import {
  Milestone,
  Landmark,
  Building,
  TrendingUp,
  Boxes,
  Waves,
  Navigation,
} from 'lucide-react';

const typeIcons = {
  Road: Milestone,
  Bridge: Waves,
  Flyover: Navigation,
  Culvert: Boxes,
  'Government Building': Landmark,
  'Government Office': Building,
  'Other Infrastructure': TrendingUp,
};

const typeColors = {
  Road: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Bridge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  Flyover: 'bg-blue-50 text-blue-800 border-blue-200',
  Culvert: 'bg-teal-50 text-teal-800 border-teal-200',
  'Government Building': 'bg-purple-50 text-purple-800 border-purple-200',
  'Government Office': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Other Infrastructure': 'bg-slate-50 text-slate-800 border-slate-200',
};

export default function AssetTypeBadge({ type, showIcon = true, size = 'md' }) {
  const IconComponent = typeIcons[type] || Milestone;
  const colorClass = typeColors[type] || 'bg-slate-50 text-slate-800 border-slate-200';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border ${colorClass} ${sizeClasses} whitespace-nowrap`}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{type}</span>
    </span>
  );
}
