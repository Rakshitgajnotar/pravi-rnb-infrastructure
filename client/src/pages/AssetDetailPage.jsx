import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Calendar,
  MapPin,
  Building,
  Shield,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  History,
  Wrench,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import assetService from '../services/assetService';
import inspectionService from '../services/inspectionService';
import maintenanceService from '../services/maintenanceService';
import StatusBadge from '../components/common/StatusBadge';
import ConditionBadge from '../components/common/ConditionBadge';
import AssetTypeBadge from '../components/common/AssetTypeBadge';
import LifecycleTimeline from '../components/assets/LifecycleTimeline';
import InspectionList from '../components/assets/InspectionList';
import MaintenanceList from '../components/assets/MaintenanceList';
import AddInspectionModal from '../components/assets/AddInspectionModal';
import AddMaintenanceModal from '../components/assets/AddMaintenanceModal';
import CompleteMaintenanceModal from '../components/assets/CompleteMaintenanceModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import RoleBadge from '../components/common/RoleBadge';

export default function AssetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentUser, can, isAdmin, isInspector, isContractor, isAuditor } = useAuth();
  const { onEditAsset, onDeleteAsset, refreshTrigger, triggerGlobalRefresh } = useOutletContext();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Modals
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [maintenanceToComplete, setMaintenanceToComplete] = useState(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const fetchAsset = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assetService.getAssetById(id);
      setAsset(data);
    } catch (err) {
      setError(err.message || 'Asset not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsset();
  }, [id, refreshTrigger]);

  // Handle Add Inspection
  const handleAddInspection = async (inspectionData) => {
    try {
      setIsSubmittingAction(true);
      const res = await inspectionService.createInspection(asset._id || asset.assetId, inspectionData);
      if (res.success) {
        showToast(
          `Field inspection recorded. Asset condition updated to ${inspectionData.condition}!`,
          'success'
        );
        setIsInspectionModalOpen(false);
        fetchAsset();
        triggerGlobalRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Failed to record inspection', 'error');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Handle Schedule Maintenance
  const handleAddMaintenance = async (maintenanceData) => {
    try {
      setIsSubmittingAction(true);
      const res = await maintenanceService.createMaintenance(asset._id || asset.assetId, maintenanceData);
      if (res.success) {
        showToast(
          `Maintenance operation "${maintenanceData.maintenanceType}" scheduled!`,
          'success'
        );
        setIsMaintenanceModalOpen(false);
        fetchAsset();
        triggerGlobalRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Failed to schedule maintenance', 'error');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Handle Complete Maintenance
  const handleCompleteMaintenance = async (maintId, updateData) => {
    try {
      setIsSubmittingAction(true);
      const res = await maintenanceService.updateMaintenance(maintId, updateData);
      if (res.success) {
        showToast(
          `Maintenance completed! Asset status restored to Active.`,
          'success'
        );
        setMaintenanceToComplete(null);
        fetchAsset();
        triggerGlobalRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Failed to complete maintenance', 'error');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Direct quick status toggle
  const handleQuickStatusChange = async (newStatus) => {
    if (!asset || asset.status === newStatus) return;
    try {
      const res = await assetService.updateAsset(asset._id || asset.assetId, { status: newStatus });
      if (res.success) {
        showToast(`Asset status updated to "${newStatus}"`, 'success');
        fetchAsset();
        triggerGlobalRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Direct quick condition toggle
  const handleQuickConditionChange = async (newCondition) => {
    if (!asset || asset.condition === newCondition) return;
    try {
      const res = await assetService.updateAsset(asset._id || asset.assetId, { condition: newCondition });
      if (res.success) {
        showToast(`Asset condition assessed as "${newCondition}"`, 'success');
        fetchAsset();
        triggerGlobalRefresh();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update condition', 'error');
    }
  };

  if (loading && !asset) {
    return <LoadingSpinner text="Fetching infrastructure asset profile..." size="lg" />;
  }

  if (error || !asset) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 shadow-card max-w-lg mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 mb-1">Infrastructure Asset Not Found</h3>
        <p className="text-xs text-slate-500 mb-6">{error || `Could not find asset with ID ${id}`}</p>
        <button
          onClick={() => navigate('/assets')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-brand-600 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-6xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/assets')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Infrastructure Directory</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Last Synchronized: {asset.updatedAt ? new Date(asset.updatedAt).toLocaleString() : 'N/A'}
        </span>
      </div>

      {/* RBAC Role Context Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs">
        <div className="flex items-center gap-2">
          <RoleBadge role={currentUser?.role} size="sm" />
          <span className="font-semibold text-slate-800">{currentUser?.name}</span>
          <span className="text-slate-400 hidden md:inline">• {currentUser?.designation}</span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium">
          {isAdmin && 'Full Executive Authority: Modifications, Audits & Deletions Unlocked'}
          {isInspector && 'Field Inspector Mode: Field Audits & Condition Rating Enabled'}
          {isContractor && 'Contractor Mode: Maintenance Work Orders & Cost Logging Enabled'}
          {isAuditor && 'Auditor Mode: Read-Only Lifecycle Oversight & Reports Access'}
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
              {asset.assetId}
            </span>
            <AssetTypeBadge type={asset.assetType} size="md" />
            <StatusBadge status={asset.status} size="md" />
            <ConditionBadge condition={asset.condition} size="md" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {asset.assetName}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <MapPin className="w-4 h-4 text-brand-600" />
              {asset.district} District {asset.taluka && `• ${asset.taluka}`}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              {asset.location}
            </span>
            {asset.constructionYear && (
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                Commissioned: {asset.constructionYear}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons (Gated by RBAC) */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          {can('canInspect') && (
            <button
              onClick={() => setIsInspectionModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-200 shadow-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>+ Inspect</span>
            </button>
          )}

          {can('canMaintain') && (
            <button
              onClick={() => setIsMaintenanceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 shadow-sm transition-all"
            >
              <Wrench className="w-4 h-4" />
              <span>+ Maintain</span>
            </button>
          )}

          {can('canEditAsset') && (
            <button
              onClick={() => onEditAsset(asset)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 shadow-sm transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}

          {can('canDeleteAsset') && (
            <button
              onClick={() => {
                onDeleteAsset(asset);
                navigate('/assets');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Status & Condition Switcher Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Switcher */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Operational Status
            </span>
            {!isAdmin && !can('canMaintain') && (
              <span className="text-[10px] text-slate-400 font-semibold italic">
                (View-only for {currentUser?.role})
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Active', 'Under Maintenance', 'Under Construction', 'Closed'].map((s) => {
              const disabled = !isAdmin && !can('canMaintain');
              return (
                <button
                  key={s}
                  disabled={disabled}
                  onClick={() => handleQuickStatusChange(s)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    asset.status === s
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Condition Switcher */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Condition Rating
            </span>
            {!isAdmin && !can('canInspect') && (
              <span className="text-[10px] text-slate-400 font-semibold italic">
                (View-only for {currentUser?.role})
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Excellent', 'Good', 'Fair', 'Poor', 'Critical'].map((c) => {
              const disabled = !isAdmin && !can('canInspect');
              return (
                <button
                  key={c}
                  disabled={disabled}
                  onClick={() => handleQuickConditionChange(c)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    asset.condition === c
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1 shadow-card gap-1 text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview & Technical Specs', icon: Layers, count: null },
          { id: 'inspections', label: 'Field Inspections', icon: ShieldCheck, count: asset.inspections?.length },
          { id: 'maintenance', label: 'Maintenance Operations', icon: Wrench, count: asset.maintenance?.length },
          { id: 'history', label: 'Lifecycle Audit Trail', icon: History, count: asset.history?.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: OVERVIEW & TECHNICAL SPECS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technical Specifications */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Infrastructure Engineering Specifications
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {asset.assetType === 'Road' && (
                  <>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-medium block mb-0.5">Length</span>
                      <span className="text-sm font-bold text-slate-800">{asset.roadLength || 'N/A'} km</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-medium block mb-0.5">Carriageway Width</span>
                      <span className="text-sm font-bold text-slate-800">{asset.roadWidth || 'N/A'} meters</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl col-span-2">
                      <span className="text-slate-400 font-medium block mb-0.5">Pavement Surface Type</span>
                      <span className="text-xs font-bold text-slate-800">{asset.surfaceType || 'Bituminous'}</span>
                    </div>
                  </>
                )}

                {asset.assetType === 'Bridge' && (
                  <>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-medium block mb-0.5">Bridge Length</span>
                      <span className="text-sm font-bold text-slate-800">{asset.bridgeLength || 'N/A'} meters</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-medium block mb-0.5">Deck Width</span>
                      <span className="text-sm font-bold text-slate-800">{asset.bridgeWidth || 'N/A'} meters</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl col-span-2">
                      <span className="text-slate-400 font-medium block mb-0.5">Superstructure Design</span>
                      <span className="text-xs font-bold text-slate-800">{asset.bridgeType || 'Concrete Box Girder'}</span>
                    </div>
                  </>
                )}

                {asset.assetType === 'Flyover' && (
                  <>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-medium block mb-0.5">Elevated Length</span>
                      <span className="text-sm font-bold text-slate-800">{asset.flyoverLength || 'N/A'} meters</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-medium block mb-0.5">Traffic Lanes</span>
                      <span className="text-sm font-bold text-slate-800">{asset.numberOfLanes || 'N/A'} Lanes</span>
                    </div>
                  </>
                )}

                {(asset.assetType === 'Government Building' || asset.assetType === 'Government Office') && (
                  <>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-medium block mb-0.5">Built-Up Area</span>
                      <span className="text-sm font-bold text-slate-800">{asset.builtUpArea?.toLocaleString() || 'N/A'} sq.m</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-medium block mb-0.5">Number of Floors</span>
                      <span className="text-sm font-bold text-slate-800">{asset.numberOfFloors || 'N/A'} Floors</span>
                    </div>
                  </>
                )}

                {(asset.assetType === 'Culvert' || asset.assetType === 'Other Infrastructure') && (
                  <>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-medium block mb-0.5">Span Width</span>
                      <span className="text-sm font-bold text-slate-800">{asset.roadWidth || 'N/A'} meters</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-slate-400 font-medium block mb-0.5">Structure Type</span>
                      <span className="text-xs font-bold text-slate-800">{asset.surfaceType || 'RCC Box / Pipe'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Geographic & Administrative Location */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">Geographical Location & Jurisdiction</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-medium block mb-0.5">Administrative District & Taluka</span>
                  <span className="text-sm font-bold text-slate-800">{asset.district} District {asset.taluka && `(${asset.taluka} Taluka)`}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-medium block mb-0.5">Corridor / Location</span>
                  <span className="text-xs font-semibold text-slate-800">{asset.location}</span>
                </div>

                {asset.address && (
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 font-medium block mb-0.5">Address Landmark</span>
                    <span className="text-xs text-slate-700">{asset.address}</span>
                  </div>
                )}

                {(asset.latitude || asset.longitude) && (
                  <div className="p-3 bg-slate-50 rounded-xl font-mono text-[11px] text-slate-600">
                    GPS Coordinates: {asset.latitude}, {asset.longitude}
                  </div>
                )}
              </div>
            </div>

            {/* Financial Valuation & Audit Dates */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card space-y-4 md:col-span-2">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <IndianRupee className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">Valuation & Inspection Lifecycle Summary</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-medium block mb-1">Estimated Asset Value</span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{(asset.estimatedCost || 0).toLocaleString()}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-medium block mb-1">Ownership Authority</span>
                  <span className="text-sm font-bold text-slate-800">{asset.ownership || 'Government'}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-medium block mb-1">Last Field Inspection</span>
                  <span className="text-sm font-bold text-slate-800">
                    {asset.lastInspectionDate ? new Date(asset.lastInspectionDate).toLocaleDateString() : 'Pending'}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-medium block mb-1">Last Maintenance Execution</span>
                  <span className="text-sm font-bold text-slate-800">
                    {asset.lastMaintenanceDate ? new Date(asset.lastMaintenanceDate).toLocaleDateString() : 'None Recorded'}
                  </span>
                </div>
              </div>

              {asset.description && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Functional Description & Scope:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{asset.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: FIELD INSPECTIONS */}
      {activeTab === 'inspections' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Field Inspection Reports</h3>
              <p className="text-xs text-slate-500">Official condition and structural integrity audit assessments</p>
            </div>
            <button
              onClick={() => setIsInspectionModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record New Inspection</span>
            </button>
          </div>

          <InspectionList
            inspections={asset.inspections || []}
            onAddInspection={() => setIsInspectionModalOpen(true)}
          />
        </div>
      )}

      {/* TAB CONTENT 3: MAINTENANCE OPERATIONS */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Maintenance & Repair Operations</h3>
              <p className="text-xs text-slate-500">Work orders, contractors, expenditure, and restoration milestones</p>
            </div>
            <button
              onClick={() => setIsMaintenanceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule Maintenance</span>
            </button>
          </div>

          <MaintenanceList
            maintenance={asset.maintenance || []}
            onAddMaintenance={() => setIsMaintenanceModalOpen(true)}
            onCompleteMaintenance={(m) => setMaintenanceToComplete(m)}
          />
        </div>
      )}

      {/* TAB CONTENT 4: LIFECYCLE AUDIT TRAIL */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900">Asset Lifecycle & Audit Trail</h3>
            <p className="text-xs text-slate-500">Complete immutable chronological timeline from construction to present</p>
          </div>

          <LifecycleTimeline events={asset.history || []} />
        </div>
      )}

      {/* Modals */}
      <AddInspectionModal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        onSubmit={handleAddInspection}
        asset={asset}
        isSubmitting={isSubmittingAction}
      />

      <AddMaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        onSubmit={handleAddMaintenance}
        asset={asset}
        isSubmitting={isSubmittingAction}
      />

      <CompleteMaintenanceModal
        isOpen={Boolean(maintenanceToComplete)}
        onClose={() => setMaintenanceToComplete(null)}
        onSubmit={handleCompleteMaintenance}
        maintenance={maintenanceToComplete}
        isSubmitting={isSubmittingAction}
      />
    </div>
  );
}
