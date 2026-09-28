import React, { useState } from 'react';
import { X, CheckCircle2, IndianRupee, AlertCircle } from 'lucide-react';

const CONDITIONS = ['Excellent', 'Good', 'Fair'];

export default function CompleteMaintenanceModal({
  isOpen,
  onClose,
  onSubmit,
  maintenance,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    actualCost: maintenance?.estimatedCost || '',
    completionDate: new Date().toISOString().split('T')[0],
    improvedCondition: 'Good',
    remarks: 'Maintenance works successfully completed and inspected by executive engineer.',
  });

  if (!isOpen || !maintenance) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(maintenance._id, {
      status: 'Completed',
      actualCost: Number(formData.actualCost) || 0,
      completionDate: formData.completionDate,
      improvedCondition: formData.improvedCondition,
      remarks: formData.remarks,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/75">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Complete Maintenance Operation</h3>
              <p className="text-xs text-slate-500 truncate max-w-xs">{maintenance.maintenanceType}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>
              Marking this maintenance as <strong>Completed</strong> will automatically restore the asset status to <strong>Active</strong> in the inventory and update its condition rating.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Actual Expenditure (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  value={formData.actualCost}
                  onChange={(e) => setFormData({ ...formData, actualCost: e.target.value })}
                  placeholder="Final billed amount"
                  className="w-full pl-7 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Completion Date *
              </label>
              <input
                type="date"
                value={formData.completionDate}
                onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Restored Asset Condition
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setFormData({ ...formData, improvedCondition: cond })}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                    formData.improvedCondition === cond
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Completion Remarks / Clearance Note
            </label>
            <textarea
              rows="2"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Finalizing...' : 'Confirm & Restore Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
