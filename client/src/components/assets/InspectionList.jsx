import React from 'react';
import { Calendar, User, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import ConditionBadge from '../common/ConditionBadge';

export default function InspectionList({ inspections = [], onAddInspection }) {
  if (!inspections || inspections.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-700">No Field Inspections Recorded Yet</h4>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Conduct regular condition and structural audits to ensure public infrastructure safety.
        </p>
        {onAddInspection && (
          <button
            onClick={onAddInspection}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 shadow-sm"
          >
            + Record Field Inspection
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inspections.map((insp) => (
        <div
          key={insp._id}
          className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <ConditionBadge condition={insp.condition} size="md" />
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {insp.inspectionDate ? new Date(insp.inspectionDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }) : 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{insp.inspectorName || 'R&B Field Officer'}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-0.5">
                Observations & Remarks:
              </span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {insp.remarks}
              </p>
            </div>

            {insp.recommendation && (
              <div>
                <span className="font-bold text-brand-700 uppercase tracking-wider text-[10px] block mb-0.5">
                  Action Recommendation:
                </span>
                <p className="text-slate-700 leading-relaxed bg-brand-50/50 p-2.5 rounded-xl border border-brand-100">
                  {insp.recommendation}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
