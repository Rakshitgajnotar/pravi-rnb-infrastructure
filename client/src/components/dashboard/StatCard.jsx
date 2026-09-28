import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'brand',
  trend,
  onClick,
}) {
  const variantStyles = {
    brand: {
      bgIcon: 'bg-brand-50 text-brand-600 border-brand-100',
      border: 'hover:border-brand-300',
      accent: 'from-brand-500/10 to-transparent',
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      border: 'hover:border-emerald-300',
      accent: 'from-emerald-500/10 to-transparent',
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-600 border-amber-100',
      border: 'hover:border-amber-300',
      accent: 'from-amber-500/10 to-transparent',
    },
    slate: {
      bgIcon: 'bg-slate-100 text-slate-600 border-slate-200',
      border: 'hover:border-slate-300',
      accent: 'from-slate-500/10 to-transparent',
    },
  };

  const style = variantStyles[variant] || variantStyles.brand;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-300 ${style.border} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Subtle top gradient glow */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.accent}`} />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </h3>
            {trend && (
              <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                {trend}
              </span>
            )}
          </div>
        </div>

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${style.bgIcon}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-4 flex items-center gap-1 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
