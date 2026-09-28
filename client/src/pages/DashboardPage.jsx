import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Boxes,
  CheckCircle2,
  Wrench,
  Hammer,
  Archive,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  Download,
  ShieldAlert,
  Activity,
  Shield,
  Search,
  HardHat,
  Eye,
  Lock,
  UserCheck,
  Table,
} from 'lucide-react';
import useStats from '../hooks/useStats';
import StatCard from '../components/dashboard/StatCard';
import StatusDonutChart from '../components/dashboard/StatusDonutChart';
import AssetTypeBarChart from '../components/dashboard/AssetTypeBarChart';
import ConditionBarChart from '../components/dashboard/ConditionBarChart';
import DistrictBarChart from '../components/dashboard/DistrictBarChart';
import AssetTable from '../components/assets/AssetTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import RoleBadge from '../components/common/RoleBadge';
import RoleSwitcherModal from '../components/common/RoleSwitcherModal';
import RBACMatrixModal from '../components/common/RBACMatrixModal';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser, can, isAdmin, isInspector, isContractor, isAuditor } = useAuth();
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);

  const { stats, loading, error, refetch } = useStats();
  const {
    refreshTrigger,
    onOpenAddModal,
    onEditAsset,
    onDeleteAsset,
    onReseed,
    isReseeding,
  } = useOutletContext();

  useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  if (loading && !stats) {
    return <LoadingSpinner text="Connecting to MongoDB & loading R&B portfolio analytics..." size="lg" />;
  }

  if (error && !stats) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 shadow-card">
        <AlertOctagon className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-rose-600 mb-1">Failed to Load Dashboard Metrics</h3>
        <p className="text-xs text-slate-500 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  const summary = stats?.summary || {
    totalAssets: 0,
    activeAssets: 0,
    maintenanceAssets: 0,
    constructionAssets: 0,
    closedAssets: 0,
    poorConditionAssets: 0,
    criticalConditionAssets: 0,
    assetsRequiringAttention: 0,
    activePercentage: 0,
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Government R&B Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-brand-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>Government Roads & Buildings (R&B) Department</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Infrastructure Asset Lifecycle & Inventory Platform
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Centralized statewide oversight for Roads, Bridges, Flyovers, Culverts, and Government Office complexes. Real-time condition tracking, inspection audits, and maintenance lifecycle coordination.
            </p>
          </div>

          {/* Action CTAs dynamically adapted per Role */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/assets')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/10 transition-all"
            >
              <span>Explore Assets Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {isAdmin && (
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Register Infrastructure</span>
              </button>
            )}

            {isInspector && (
              <button
                onClick={() => navigate('/assets?condition=Poor')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Audit Critical Assets</span>
              </button>
            )}

            {isContractor && (
              <button
                onClick={() => navigate('/maintenance')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition-all"
              >
                <Wrench className="w-4 h-4" />
                <span>Execute Work Orders</span>
              </button>
            )}

            {isAuditor && (
              <button
                onClick={() => navigate('/reports')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>View & Export Audits</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative background glows */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-brand-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Prominent Official Persona & RBAC Security Clearance Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-brand-700 text-white font-extrabold text-base flex items-center justify-center shadow-md shrink-0">
            {currentUser?.name
              ?.split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('') || 'RB'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900">{currentUser?.name}</span>
              <RoleBadge role={currentUser?.role} size="sm" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {currentUser?.division}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Official Title: <strong className="text-slate-700">{currentUser?.designation}</strong>
            </div>

            {/* Permissions breakdown */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {isAdmin && (
                <>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Full Asset CRUD
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Asset Decommissioning
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Budget & Maintenance Approval
                  </span>
                </>
              )}
              {isInspector && (
                <>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    <CheckCircle2 className="w-3 h-3" /> Field Inspection Audits
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    <CheckCircle2 className="w-3 h-3" /> Structural Condition Grading
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <Lock className="w-3 h-3" /> Registration Restricted
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <Lock className="w-3 h-3" /> Deletion Restricted
                  </span>
                </>
              )}
              {isContractor && (
                <>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <CheckCircle2 className="w-3 h-3" /> Maintenance Execution
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <CheckCircle2 className="w-3 h-3" /> Actual Expenditure Logging
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <Lock className="w-3 h-3" /> Registration Restricted
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <Lock className="w-3 h-3" /> Deletion Restricted
                  </span>
                </>
              )}
              {isAuditor && (
                <>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Read-Only Statewide Oversight
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Reports & CSV Export
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <Lock className="w-3 h-3" /> Asset Creation Blocked
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <Lock className="w-3 h-3" /> Modifying Records Blocked
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <Lock className="w-3 h-3" /> Deletions Blocked
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Switch Persona & Matrix buttons */}
        <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
          <button
            onClick={() => setMatrixModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-brand-600" />
            <span>View RBAC Matrix</span>
          </button>

          <button
            onClick={() => setRoleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all"
          >
            <UserCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>Switch Role</span>
          </button>
        </div>
      </div>

      {/* 8 Primary Government Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Portfolio Health & Status Metrics
          </h2>
          <span className="text-xs text-slate-400">Live MongoDB Aggregation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Infrastructure"
            value={summary.totalAssets}
            subtitle="Registered state assets"
            icon={Boxes}
            trend="Statewide Portfolio"
            trendType="neutral"
            onClick={() => navigate('/assets')}
          />
          <StatCard
            title="Active Operational"
            value={summary.activeAssets}
            subtitle={`${summary.activePercentage || 0}% operational capacity`}
            icon={CheckCircle2}
            trend="Active in Service"
            trendType="positive"
            onClick={() => navigate('/assets?status=Active')}
          />
          <StatCard
            title="Under Maintenance"
            value={summary.maintenanceAssets}
            subtitle="Active restoration works"
            icon={Wrench}
            trend="Works in Progress"
            trendType="warning"
            onClick={() => navigate('/assets?status=Under Maintenance')}
          />
          <StatCard
            title="Under Construction"
            value={summary.constructionAssets}
            subtitle="New alignments & bridges"
            icon={Hammer}
            trend="Ongoing Capital Projects"
            trendType="neutral"
            onClick={() => navigate('/assets?status=Under Construction')}
          />
          <StatCard
            title="Closed / Decommissioned"
            value={summary.closedAssets}
            subtitle="Retired or bypassed"
            icon={Archive}
            trend="End-of-service lifecycle"
            trendType="neutral"
            onClick={() => navigate('/assets?status=Closed')}
          />
          <StatCard
            title="Poor Condition Assets"
            value={summary.poorConditionAssets}
            subtitle="Structural deterioration"
            icon={AlertTriangle}
            trend="Repair Intervention Needed"
            trendType="warning"
            onClick={() => navigate('/assets?condition=Poor')}
          />
          <StatCard
            title="Critical Condition"
            value={summary.criticalConditionAssets}
            subtitle="Immediate safety risk"
            icon={AlertOctagon}
            trend="Emergency Inspection"
            trendType="danger"
            onClick={() => navigate('/assets?condition=Critical')}
          />
          <StatCard
            title="Attention Required"
            value={summary.assetsRequiringAttention}
            subtitle="Combined Poor & Critical"
            icon={ShieldAlert}
            trend="Maintenance Watchlist"
            trendType="danger"
            onClick={() => navigate('/assets?condition=Critical')}
          />
        </div>
      </div>

      {/* Visual Analytics Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDonutChart
          data={stats?.assetsByStatus || stats?.statusBreakdown || []}
          totalAssets={summary.totalAssets}
        />
        <ConditionBarChart
          data={stats?.assetsByCondition || stats?.conditionBreakdown || []}
        />
        <AssetTypeBarChart
          data={(stats?.assetsByType || stats?.typeBreakdown || []).map((t) => ({
            name: t.name || t.type || t._id,
            count: t.count || t.value || 0,
          }))}
        />
        <DistrictBarChart
          data={stats?.assetsByDistrict || stats?.districtBreakdown || []}
        />
      </div>

      {/* Recently Added Assets Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Recently Commissioned Infrastructure
            </h2>
            <p className="text-xs text-slate-500">
              Latest assets logged into the Roads & Buildings central registry
            </p>
          </div>
          <button
            onClick={() => navigate('/assets')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>View All Assets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <AssetTable
          assets={stats?.recentlyAdded || stats?.recentAssets || []}
          onView={(asset) => navigate(`/assets/${asset.assetId || asset._id}`)}
          onEdit={onEditAsset}
          onDelete={onDeleteAsset}
        />
      </div>

      {/* Modals */}
      <RoleSwitcherModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />

      <RBACMatrixModal
        isOpen={matrixModalOpen}
        onClose={() => setMatrixModalOpen(false)}
      />
    </div>
  );
}
