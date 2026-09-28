import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

const conditionConfig = {
  Excellent: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: ShieldCheck,
    dot: 'bg-emerald-500',
  },
  Good: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: CheckCircle2,
    dot: 'bg-blue-500',
  },
  Fair: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: AlertTriangle,
    dot: 'bg-amber-500',
  },
  Poor: {
    bg: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: AlertTriangle,
    dot: 'bg-orange-500',
  },
  Critical: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-200',
    icon: AlertOctagon,
    dot: 'bg-rose-500',
    animate: true,
  },
};

export default function ConditionBadge({ condition, size = 'md', showIcon = true }) {
  const config = conditionConfig[condition] || conditionConfig.Good;
  const Icon = config.icon || HelpCircle;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses} whitespace-nowrap`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {!showIcon && (
        <span className="relative flex h-2 w-2">
          {config.animate && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
        </span>
      )}
      <span>{condition}</span>
    </span>
  );
}
