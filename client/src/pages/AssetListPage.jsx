import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  PlusCircle,
  Download,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Lock,
} from 'lucide-react';
import useAssets from '../hooks/useAssets';
import AssetTable from '../components/assets/AssetTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import RoleBadge from '../components/common/RoleBadge';

const ASSET_TYPES = [
  'All',
  'Road',
  'Bridge',
  'Flyover',
  'Culvert',
  'Government Building',
  'Government Office',
  'Other Infrastructure',
];

const DISTRICTS = [
  'All',
  'Ahmedabad',
  'Gandhinagar',
  'Surat',
  'Vadodara',
  'Rajkot',
  'Bhavnagar',
  'Jamnagar',
  'Junagadh',
  'Kheda',
  'Anand',
  'Mehsana',
  'Patan',
  'Kutch',
  'Bharuch',
];

const STATUS_TABS = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Under Maintenance', value: 'Under Maintenance' },
  { label: 'Under Construction', value: 'Under Construction' },
  { label: 'Closed / Retired', value: 'Closed' },
];

const CONDITIONS = ['All', 'Excellent', 'Good', 'Fair', 'Poor', 'Critical'];

export default function AssetListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, can } = useAuth();

  const {
    refreshTrigger,
    onOpenAddModal,
    onEditAsset,
    onDeleteAsset,
  } = useOutletContext();

  // URL query params
  const initialSearch = searchParams.get('search') || '';
  const initialType = searchParams.get('assetType') || 'All';
  const initialDistrict = searchParams.get('district') || 'All';
  const initialStatus = searchParams.get('status') || 'All';
  const initialCondition = searchParams.get('condition') || 'All';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedCondition, setSelectedCondition] = useState(initialCondition);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const {
    assets,
    total,
    currentPage,
    totalPages,
    loading,
    error,
    updateFilters,
    refetch,
  } = useAssets({
    search: initialSearch,
    assetType: initialType,
    district: initialDistrict,
    status: initialStatus,
    condition: initialCondition,
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 15,
  });

  // Debounce search input (MODULE 11: Debounced search on frontend)
  const searchTimeoutRef = useRef(null);
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      applyFilters({ search: val, page: 1 });
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  // Sync when URL params change
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlType = searchParams.get('assetType') || 'All';
    const urlDistrict = searchParams.get('district') || 'All';
    const urlStatus = searchParams.get('status') || 'All';
    const urlCondition = searchParams.get('condition') || 'All';

    setSearchTerm(urlSearch);
    setSelectedType(urlType);
    setSelectedDistrict(urlDistrict);
    setSelectedStatus(urlStatus);
    setSelectedCondition(urlCondition);

    updateFilters({
      search: urlSearch,
      assetType: urlType,
      district: urlDistrict,
      status: urlStatus,
      condition: urlCondition,
      page: 1,
    });
  }, [searchParams]);

  useEffect(() => {
    refetch();
  }, [refreshTrigger]);

  const applyFilters = (newFilters) => {
    const updated = {
      search: searchTerm,
      assetType: selectedType,
      district: selectedDistrict,
      status: selectedStatus,
      condition: selectedCondition,
      sortBy,
      order,
      ...newFilters,
    };

    const nextParams = {};
    if (updated.search) nextParams.search = updated.search;
    if (updated.assetType && updated.assetType !== 'All') nextParams.assetType = updated.assetType;
    if (updated.district && updated.district !== 'All') nextParams.district = updated.district;
    if (updated.status && updated.status !== 'All') nextParams.status = updated.status;
    if (updated.condition && updated.condition !== 'All') nextParams.condition = updated.condition;
    setSearchParams(nextParams);

    updateFilters(updated);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    applyFilters({ status, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('All');
    setSelectedDistrict('All');
    setSelectedStatus('All');
    setSelectedCondition('All');
    setSortBy('createdAt');
    setOrder('desc');
    setSearchParams({});
    updateFilters({
      search: '',
      assetType: 'All',
      district: 'All',
      status: 'All',
      condition: 'All',
      sortBy: 'createdAt',
      order: 'desc',
      page: 1,
    });
  };

  // CSV Export utility (MODULE 16)
  const handleExportCSV = () => {
    if (!assets || assets.length === 0) return;

    const headers = [
      'Asset ID',
      'Asset Name',
      'Asset Type',
      'District',
      'Taluka',
      'Location',
      'Status',
      'Condition',
      'Ownership',
      'Construction Year',
      'Estimated Cost (INR)',
      'Last Inspection Date',
      'Last Maintenance Date',
      'Road Length (km)',
      'Bridge Length (m)',
      'Built-Up Area (sq m)',
    ];

    const rows = assets.map((a) => [
      `"${a.assetId || ''}"`,
      `"${(a.assetName || '').replace(/"/g, '""')}"`,
      `"${a.assetType || ''}"`,
      `"${a.district || ''}"`,
      `"${a.taluka || ''}"`,
      `"${(a.location || '').replace(/"/g, '""')}"`,
      `"${a.status || ''}"`,
      `"${a.condition || ''}"`,
      `"${a.ownership || 'Government'}"`,
      `"${a.constructionYear || ''}"`,
      `"${a.estimatedCost || 0}"`,
      `"${a.lastInspectionDate ? new Date(a.lastInspectionDate).toISOString().substring(0, 10) : ''}"`,
      `"${a.lastMaintenanceDate ? new Date(a.lastMaintenanceDate).toISOString().substring(0, 10) : ''}"`,
      `"${a.roadLength || ''}"`,
      `"${a.bridgeLength || ''}"`,
      `"${a.builtUpArea || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rnb_infrastructure_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title & Top CTA Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Infrastructure Assets Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
              {total} Infrastructure Assets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, audit condition, and track lifecycle across state roads, bridges, and buildings
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            disabled={assets.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Filtered CSV</span>
          </button>

          {can('canCreateAsset') ? (
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Asset</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-amber-900 text-xs font-semibold shadow-sm">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Registration Restricted (Executive Engineer Only)</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {STATUS_TABS.map((tab) => {
          const isActive = selectedStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleStatusChange(tab.value)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Advanced Filter and Debounced Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Debounced Search (MODULE 11) */}
          <div className="sm:col-span-4 relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Asset ID, Name, District, Location..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>

          {/* Asset Type Filter (MODULE 12) */}
          <div className="sm:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                applyFilters({ assetType: e.target.value, page: 1 });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 font-medium"
            >
              {ASSET_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Asset Types' : t}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter (MODULE 12) */}
          <div className="sm:col-span-2">
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                applyFilters({ district: e.target.value, page: 1 });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 font-medium"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Districts' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter (MODULE 12) */}
          <div className="sm:col-span-2">
            <select
              value={selectedCondition}
              onChange={(e) => {
                setSelectedCondition(e.target.value);
                applyFilters({ condition: e.target.value, page: 1 });
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 font-medium"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Conditions' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector (MODULE 13) */}
          <div className="sm:col-span-1">
            <select
              value={`${sortBy}:${order}`}
              onChange={(e) => {
                const [f, d] = e.target.value.split(':');
                setSortBy(f);
                setOrder(d);
                applyFilters({ sortBy: f, order: d, page: 1 });
              }}
              className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="createdAt:desc">Newest</option>
              <option value="createdAt:asc">Oldest</option>
              <option value="assetName:asc">Name A-Z</option>
              <option value="assetName:desc">Name Z-A</option>
              <option value="constructionYear:desc">Year (Recent)</option>
              <option value="constructionYear:asc">Year (Oldest)</option>
              <option value="estimatedCost:desc">Highest Value</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="sm:col-span-1 flex justify-end">
            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(searchTerm || selectedType !== 'All' || selectedDistrict !== 'All' || selectedStatus !== 'All' || selectedCondition !== 'All') && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">Active Filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-medium">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedType !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium">
                Type: {selectedType}
              </span>
            )}
            {selectedDistrict !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 text-xs font-medium">
                District: {selectedDistrict}
              </span>
            )}
            {selectedStatus !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                Status: {selectedStatus}
              </span>
            )}
            {selectedCondition !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
                Condition: {selectedCondition}
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-brand-600 hover:underline font-semibold ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Asset Table */}
      {loading ? (
        <LoadingSpinner text="Querying R&B infrastructure database..." />
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 shadow-card">
          <p className="text-sm font-semibold text-rose-600 mb-2">Error loading assets: {error}</p>
          <button
            onClick={refetch}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-brand-600 rounded-xl"
          >
            Retry
          </button>
        </div>
      ) : (
        <AssetTable
          assets={assets}
          onView={(asset) => navigate(`/assets/${asset.assetId || asset._id}`)}
          onEdit={onEditAsset}
          onDelete={onDeleteAsset}
          onAddNew={onOpenAddModal}
        />
      )}

      {/* Backend Pagination (MODULE 14) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="text-xs text-slate-500 font-medium">
            Showing Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
            <strong className="text-slate-800">{totalPages}</strong> ({total} total assets)
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1 || loading}
              onClick={() => updateFilters({ page: currentPage - 1 })}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => updateFilters({ page: num })}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  currentPage === num
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {num}
              </button>
            ))}

            <button
              disabled={currentPage >= totalPages || loading}
              onClick={() => updateFilters({ page: currentPage + 1 })}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
