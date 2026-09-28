import React from 'react';
import {
  Wrench,
  Calendar,
  IndianRupee,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function MaintenanceList({
  maintenance = [],
  onAddMaintenance,
  onCompleteMaintenance,
}) {
  if (!maintenance || maintenance.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <Wrench className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-700">No Maintenance Operations Recorded</h4>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Track road resurfacing, structural retrofits, desilting, and facility repairs.
        </p>
        {onAddMaintenance && (
          <button
            onClick={onAddMaintenance}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 shadow-sm"
          >
            + Schedule Maintenance
          </button>
        )}
      </div>
    );
  }

  const statusColors = {
    Planned: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="space-y-4">
      {maintenance.map((m) => {
        const isCompleted = m.status === 'Completed';
        const isInProgress = m.status === 'In Progress';

        return (
          <div
            key={m._id}
            className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${
                    statusColors[m.status] || 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : isInProgress ? (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  )}
                  {m.status}
                </span>

                <h4 className="text-sm font-bold text-slate-900">{m.maintenanceType}</h4>
              </div>

              {/* Complete button if In Progress or Planned */}
              {!isCompleted && onCompleteMaintenance && (
                <button
                  onClick={() => onCompleteMaintenance(m)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Completed</span>
                </button>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {m.description}
            </p>

            {/* Metadata Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Scheduled / Started
                </span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {m.maintenanceDate ? new Date(m.maintenanceDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Financials (₹)
                </span>
                <span className="font-semibold text-slate-800">
                  Est: ₹{(m.estimatedCost || 0).toLocaleString()}
                  {m.actualCost > 0 && ` • Act: ₹${m.actualCost.toLocaleString()}`}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Contractor Agency
                </span>
                <span className="font-semibold text-slate-800 truncate block">
                  {m.contractor || 'Departmental Execution'}
                </span>
              </div>
            </div>

            {isCompleted && m.completionDate && (
              <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>
                  Successfully completed on {new Date(m.completionDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
