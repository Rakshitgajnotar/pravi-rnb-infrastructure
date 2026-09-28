import React from 'react';
import { DollarSign, ShieldAlert, Activity, RefreshCw } from 'lucide-react';

export default function QuickMetrics({ summary, onReseed, isReseeding = false }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Portfolio Value */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-brand-50/30 p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-100/70 text-brand-700">
            Valuation
          </span>
        </div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Total Inventory Value
        </p>
        <h4 className="text-2xl font-black text-slate-900 mt-1">
          ${(summary.totalCost || 0).toLocaleString()}
        </h4>
        <p className="text-xs text-slate-500 mt-2">
          Estimated acquisition cost of all tracked hardware
        </p>
      </div>

      {/* Operational Health Rate */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-emerald-50/30 p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-700">
            {summary.activePercentage}% Active
          </span>
        </div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Fleet Health & Utilization
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <h4 className="text-2xl font-black text-slate-900">
            {summary.activeAssets} / {summary.totalAssets}
          </h4>
          <span className="text-xs text-slate-500">online</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${summary.activePercentage || 0}%` }}
          />
        </div>
      </div>

      {/* Warranty & Lifecycle Alerts */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-amber-50/30 p-5 shadow-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100/70 text-amber-700">
              Warranty Watch
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Expiring Within 90 Days
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-2xl font-black text-amber-600">
              {summary.expiringWarrantyCount || 0}
            </h4>
            <span className="text-xs text-slate-500">
              contracts require renewal review
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100/80 mt-2 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {summary.expiredWarrantyCount || 0} expired warranties
          </span>
          {onReseed && (
            <button
              onClick={onReseed}
              disabled={isReseeding}
              title="Reset sample records for live presentation demo"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReseeding ? 'animate-spin' : ''}`} />
              <span>Reset Demo Data</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
