import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Wrench,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  ArrowRight,
  Filter,
} from 'lucide-react';
import maintenanceService from '../services/maintenanceService';
import CompleteMaintenanceModal from '../components/assets/CompleteMaintenanceModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import RoleBadge from '../components/common/RoleBadge';

export default function MaintenancePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentUser, can } = useAuth();
  const { refreshTrigger, triggerGlobalRefresh } = useOutletContext();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [maintenanceToComplete, setMaintenanceToComplete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMaintenance = async (status) => {
    try {
      setLoading(true);
      setError(null);
      const params = status && status !== 'All' ? { status } : {};
      const data = await maintenanceService.getAllMaintenance(params);
      setRecords(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load maintenance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance(statusFilter);
  }, [statusFilter, refreshTrigger]);

  const handleComplete = async (maintId, updateData) => {
    try {
      setIsSubmitting(true);
      const res = await maintenanceService.updateMaintenance(maintId, updateData);
      if (res.success) {
        showToast('Maintenance marked as Completed! Asset restored to Active.', 'success');
        setMaintenanceToComplete(null);
        fetchMaintenance(statusFilter);
        triggerGlobalRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Failed to complete maintenance', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColors = {
    Planned: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const totalCost = records.reduce((acc, curr) => acc + (curr.actualCost || curr.estimatedCost || 0), 0);
  const inProgressCount = records.filter((r) => r.status === 'In Progress').length;
  const plannedCount = records.filter((r) => r.status === 'Planned').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Statewide Infrastructure Maintenance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {records.length} Work Orders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time tracking of active road resurfacing, bridge structural repairs, desilting, and facility overhauls
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active Maintenance Works
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-amber-600">{inProgressCount}</h3>
            <span className="text-xs text-slate-500">jobs under execution</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Planned & Sanctioned Works
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-indigo-600">{plannedCount}</h3>
            <span className="text-xs text-slate-500">awaiting ground execution</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Maintenance Allocation
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900">₹{totalCost.toLocaleString()}</h3>
            <span className="text-xs text-slate-500">estimated expenditure</span>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        {['All', 'In Progress', 'Planned', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              statusFilter === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab === 'All' ? 'All Operations' : tab}
          </button>
        ))}
      </div>

      {/* Main Maintenance List Table */}
      {loading ? (
        <LoadingSpinner text="Fetching state maintenance operations..." />
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 shadow-card">
          <p className="text-sm font-semibold text-rose-600 mb-2">{error}</p>
        </div>
      ) : records.length === 0 ? (
        <EmptyState
          title="No Maintenance Records Found"
          description="There are currently no maintenance work orders matching the selected status filter."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Infrastructure Asset</th>
                <th className="py-3.5 px-4">Maintenance Scope & Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Financials (₹)</th>
                <th className="py-3.5 px-4">Contractor Agency</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {records.map((m) => {
                const asset = m.assetId;
                const isCompleted = m.status === 'Completed';

                return (
                  <tr key={m._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      {asset ? (
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                            {asset.assetId}
                          </span>
                          <div
                            onClick={() => navigate(`/assets/${asset.assetId || asset._id}`)}
                            className="text-sm font-bold text-slate-900 truncate hover:text-brand-600 cursor-pointer max-w-xs"
                            title={asset.assetName}
                          >
                            {asset.assetName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {asset.district} • {asset.location}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Decommissioned Asset</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs">
                      <div className="font-bold text-slate-800 mb-0.5">{m.maintenanceType}</div>
                      <p className="text-slate-500 line-clamp-2 max-w-xs leading-relaxed">
                        {m.description}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${
                          statusColors[m.status] || 'bg-slate-50 text-slate-700'
                        }`}
                      >
                        {m.status === 'In Progress' && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        )}
                        {m.status === 'Completed' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        {m.status === 'Planned' && (
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        )}
                        {m.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs">
                      <div className="font-semibold text-slate-800">
                        Est: ₹{(m.estimatedCost || 0).toLocaleString()}
                      </div>
                      {m.actualCost > 0 && (
                        <div className="text-emerald-600 font-bold">
                          Act: ₹{m.actualCost.toLocaleString()}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600 font-medium">
                      {m.contractor || 'Departmental Execution'}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-500">
                      {m.maintenanceDate ? new Date(m.maintenanceDate).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {!isCompleted ? (
                        can('canMaintain') ? (
                          <button
                            onClick={() => setMaintenanceToComplete(m)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">In Execution</span>
                        )
                      ) : (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Restored</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Complete Modal */}
      <CompleteMaintenanceModal
        isOpen={Boolean(maintenanceToComplete)}
        onClose={() => setMaintenanceToComplete(null)}
        onSubmit={handleComplete}
        maintenance={maintenanceToComplete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
