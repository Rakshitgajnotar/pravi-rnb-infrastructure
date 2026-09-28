import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, Calendar, User } from 'lucide-react';

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'];

export default function AddInspectionModal({
  isOpen,
  onClose,
  onSubmit,
  asset,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    inspectionDate: new Date().toISOString().split('T')[0],
    inspectorName: 'Er. R&B Field Officer',
    condition: asset?.condition || 'Fair',
    remarks: '',
    recommendation: '',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen || !asset) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.inspectionDate) newErrors.inspectionDate = 'Inspection date is required';
    if (!formData.inspectorName.trim()) newErrors.inspectorName = 'Inspector / officer name is required';
    if (!formData.condition) newErrors.condition = 'Condition assessment is required';
    if (!formData.remarks.trim()) newErrors.remarks = 'Field observations/remarks are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/75">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Record Field Inspection</h3>
              <p className="text-xs text-slate-500">
                Asset: {asset.assetId} • {asset.assetName}
              </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Date & Inspector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Inspection Date *
              </label>
              <input
                type="date"
                value={formData.inspectionDate}
                onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              {errors.inspectionDate && (
                <p className="text-xs text-rose-500 mt-1">{errors.inspectionDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Inspector Name / Designation *
              </label>
              <input
                type="text"
                placeholder="e.g. Er. Patel (Dy. Executive Engineer)"
                value={formData.inspectorName}
                onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              {errors.inspectorName && (
                <p className="text-xs text-rose-500 mt-1">{errors.inspectorName}</p>
              )}
            </div>
          </div>

          {/* Row 2: Condition Assessment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Assessed Physical Condition *
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CONDITIONS.map((cond) => {
                const isSelected = formData.condition === cond;
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setFormData({ ...formData, condition: cond })}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cond}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-brand-600 mt-1.5">
              Notice: Submitting will update current asset condition from{' '}
              <strong>{asset.condition}</strong> to <strong>{formData.condition}</strong>.
            </p>
          </div>

          {/* Row 3: Field Observations / Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Field Observations & Remarks *
            </label>
            <textarea
              rows="3"
              placeholder="e.g. Surface cracking observed along 200m section; scour around bridge pier #3..."
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className={`w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
                errors.remarks ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.remarks && (
              <p className="text-xs text-rose-500 mt-1">{errors.remarks}</p>
            )}
          </div>

          {/* Row 4: Recommendation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Action Recommendation (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Schedule preventive bituminous overlay within next quarter..."
              value={formData.recommendation}
              onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          {/* Actions */}
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
              className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : 'Submit Field Inspection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
