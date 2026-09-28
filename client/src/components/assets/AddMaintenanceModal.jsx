import React, { useState } from 'react';
import { X, Wrench, IndianRupee, AlertCircle, Calendar } from 'lucide-react';

const MAINTENANCE_TYPES = [
  'Road Resurfacing & Asphalt Overlay',
  'Pavement Milling & Crack Sealing',
  'Bridge Expansion Joint Replacement',
  'Pier & Girder Structural Retrofit',
  'Drainage Desilting & Culvert Clearing',
  'Flyover Crash Barrier & Railing Repair',
  'Building Waterproofing & Painting',
  'Electrical & HVAC Overhaul',
  'Routine Preventive Maintenance',
  'Emergency Flood Damage Restoration',
];

export default function AddMaintenanceModal({
  isOpen,
  onClose,
  onSubmit,
  asset,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    maintenanceDate: new Date().toISOString().split('T')[0],
    maintenanceType: MAINTENANCE_TYPES[0],
    description: '',
    status: 'In Progress',
    estimatedCost: '',
    contractor: '',
    remarks: '',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen || !asset) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.maintenanceDate) newErrors.maintenanceDate = 'Maintenance date is required';
    if (!formData.maintenanceType.trim()) newErrors.maintenanceType = 'Maintenance type is required';
    if (!formData.description.trim()) newErrors.description = 'Work description / scope is required';
    if (formData.estimatedCost && (isNaN(formData.estimatedCost) || Number(formData.estimatedCost) < 0)) {
      newErrors.estimatedCost = 'Cost must be a valid positive amount';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/75">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Schedule Infrastructure Maintenance</h3>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Scheduled Date *
              </label>
              <input
                type="date"
                value={formData.maintenanceDate}
                onChange={(e) => setFormData({ ...formData, maintenanceDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
              {errors.maintenanceDate && (
                <p className="text-xs text-rose-500 mt-1">{errors.maintenanceDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Initial Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-semibold bg-white"
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress (Active Work)</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Row 2: Maintenance Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Maintenance Type *
            </label>
            <select
              value={formData.maintenanceType}
              onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium bg-white"
            >
              {MAINTENANCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Row 3: Description / Scope */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Scope of Work / Technical Specifications *
            </label>
            <textarea
              rows="3"
              placeholder="e.g. 50mm milling of rutted bituminous surface, tack coat application, followed by 50mm BC overlay..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
                errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Row 4: Estimated Cost & Contractor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Estimated Sanction (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 2500000"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                  className="w-full pl-7 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              {errors.estimatedCost && (
                <p className="text-xs text-rose-500 mt-1">{errors.estimatedCost}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Contractor / Agency
              </label>
              <input
                type="text"
                placeholder="e.g. Gujarat State Infra Corp"
                value={formData.contractor}
                onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          {formData.status === 'In Progress' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                Note: Setting status to <strong>In Progress</strong> will automatically transition the asset status to <strong>Under Maintenance</strong> in the central inventory.
              </span>
            </div>
          )}

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
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Authorize Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
