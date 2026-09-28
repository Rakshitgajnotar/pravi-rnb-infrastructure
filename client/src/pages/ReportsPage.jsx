import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  Filter,
  Layers,
  MapPin,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Table,
  ExternalLink,
  DollarSign,
  Clock,
  Building2,
} from 'lucide-react';
import assetService from '../services/assetService';
import maintenanceService from '../services/maintenanceService';
import StatusBadge from '../components/common/StatusBadge';
import ConditionBadge from '../components/common/ConditionBadge';
import AssetTypeBadge from '../components/common/AssetTypeBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const REPORT_TYPES = [
  { id: 'inventory', title: 'Asset Inventory Master Report', description: 'Comprehensive catalog of all state roads, bridges, flyovers, and buildings.' },
  { id: 'critical', title: 'Critical & Poor Condition Watchlist', description: 'High-risk infrastructure assets demanding urgent structural intervention.' },
  { id: 'district', title: 'District Administrative Report', description: 'Geographical distribution and asset health segmented by district.' },
  { id: 'type', title: 'Asset Type & Classification Report', description: 'Technical summaries across Roads, Bridges, Culverts, and Complexes.' },
  { id: 'maintenance', title: 'Maintenance & Expenditure Audit', description: 'Active work orders, completed restorations, and budget allocations.' },
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
  'Mehsana',
  'Patan',
  'Kutch',
  'Bharuch',
];

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

export default function ReportsPage() {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState('inventory');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [maintenanceStatusFilter, setMaintenanceStatusFilter] = useState('All');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      if (selectedReport === 'maintenance') {
        const params = {};
        if (maintenanceStatusFilter !== 'All') {
          params.status = maintenanceStatusFilter;
        }
        const res = await maintenanceService.getAllMaintenance(params);
        setData(res || []);
      } else {
        const params = {
          limit: 100,
          district: districtFilter !== 'All' ? districtFilter : undefined,
          assetType: typeFilter !== 'All' ? typeFilter : undefined,
          condition: selectedReport === 'critical' ? undefined : (conditionFilter !== 'All' ? conditionFilter : undefined),
        };
        const res = await assetService.getAssets(params);
        let assets = res.data || [];
        if (selectedReport === 'critical') {
          assets = assets.filter((a) => a.condition === 'Critical' || a.condition === 'Poor');
        }
        setData(assets);
      }

      const st = await assetService.getStats();
      setStats(st);
    } catch (err) {
      console.error('Failed to load report data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedReport, districtFilter, typeFilter, conditionFilter, maintenanceStatusFilter]);

  // CSV Export for the generated report
  const handleExportCSV = () => {
    if (!data || data.length === 0) return;

    let headers = [];
    let rows = [];

    if (selectedReport === 'maintenance') {
      headers = ['Maintenance ID', 'Asset ID', 'Asset Name', 'Type', 'Status', 'Estimated Cost (INR)', 'Actual Cost (INR)', 'Contractor', 'Date'];
      rows = data.map((m) => {
        const assetCode = typeof m.assetId === 'object' ? (m.assetId?.assetId || '') : (m.assetId || '');
        const assetName = typeof m.assetId === 'object' ? (m.assetId?.assetName || '') : '';
        return [
          `"${m._id}"`,
          `"${assetCode}"`,
          `"${assetName.replace(/"/g, '""')}"`,
          `"${m.maintenanceType || ''}"`,
          `"${m.status || ''}"`,
          `"${m.estimatedCost || 0}"`,
          `"${m.actualCost || 0}"`,
          `"${(m.contractor || '').replace(/"/g, '""')}"`,
          `"${m.maintenanceDate ? new Date(m.maintenanceDate).toISOString().substring(0, 10) : ''}"`,
        ];
      });
    } else {
      headers = ['Asset ID', 'Asset Name', 'Asset Type', 'District', 'Location', 'Status', 'Condition', 'Construction Year', 'Estimated Value (INR)'];
      rows = data.map((a) => {
        const assetCode = typeof a.assetId === 'object' ? (a.assetId?.assetId || '') : (a.assetId || '');
        return [
          `"${assetCode}"`,
          `"${(a.assetName || '').replace(/"/g, '""')}"`,
          `"${a.assetType || ''}"`,
          `"${a.district || ''}"`,
          `"${(a.location || '').replace(/"/g, '""')}"`,
          `"${a.status || ''}"`,
          `"${a.condition || ''}"`,
          `"${a.constructionYear || ''}"`,
          `"${a.estimatedCost || 0}"`,
        ];
      });
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rnb_report_${selectedReport}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Maintenance summary figures
  const maintenanceMetrics = React.useMemo(() => {
    if (selectedReport !== 'maintenance' || !Array.isArray(data)) return null;
    const totalCount = data.length;
    const inProgress = data.filter((m) => m.status === 'In Progress').length;
    const completed = data.filter((m) => m.status === 'Completed').length;
    const planned = data.filter((m) => m.status === 'Planned').length;
    const totalEst = data.reduce((acc, m) => acc + (Number(m.estimatedCost) || 0), 0);
    const totalActual = data.reduce((acc, m) => acc + (Number(m.actualCost) || 0), 0);
    return { totalCount, inProgress, completed, planned, totalEst, totalActual };
  }, [selectedReport, data]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Executive Infrastructure Reports & Audits
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
              R&B Official Reporting
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate, filter, and export verified ministerial and departmental audit reports
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={data.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Official CSV Report</span>
        </button>
      </div>

      {/* Report Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {REPORT_TYPES.map((rep) => {
          const isSelected = selectedReport === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-brand-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileText className={`w-4 h-4 mb-2 ${isSelected ? 'text-brand-400' : 'text-slate-400'}`} />
              <div className="text-xs font-bold leading-snug mb-1">{rep.title}</div>
              <p className={`text-[10px] line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                {rep.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Maintenance Metric Summary Cards when viewing Maintenance Report */}
      {selectedReport === 'maintenance' && maintenanceMetrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-card">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Work Orders</span>
            <span className="text-xl font-extrabold text-slate-900 mt-1 block">{maintenanceMetrics.totalCount}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">{maintenanceMetrics.planned} Planned</span>
          </div>
          <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/70 shadow-card">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Active In Progress</span>
            <span className="text-xl font-extrabold text-amber-900 mt-1 block">{maintenanceMetrics.inProgress}</span>
            <span className="text-[10px] text-amber-700 mt-0.5 block">Assets undergoing works</span>
          </div>
          <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/70 shadow-card">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Restored / Completed</span>
            <span className="text-xl font-extrabold text-emerald-900 mt-1 block">{maintenanceMetrics.completed}</span>
            <span className="text-[10px] text-emerald-700 mt-0.5 block">Assets restored to Active</span>
          </div>
          <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-200/70 shadow-card">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">Total Expenditure</span>
            <span className="text-lg font-extrabold font-mono text-blue-900 mt-1 block">
              ₹{maintenanceMetrics.totalActual > 0 ? maintenanceMetrics.totalActual.toLocaleString() : maintenanceMetrics.totalEst.toLocaleString()}
            </span>
            <span className="text-[10px] text-blue-700 mt-0.5 block">
              Budget Est: ₹{maintenanceMetrics.totalEst.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Pre-Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Audit Filters:</span>
        </div>

        {selectedReport === 'maintenance' ? (
          <div>
            <select
              value={maintenanceStatusFilter}
              onChange={(e) => setMaintenanceStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Work Statuses</option>
              <option value="Planned">Planned Operations</option>
              <option value="In Progress">Active In Progress</option>
              <option value="Completed">Completed Works</option>
            </select>
          </div>
        ) : (
          <>
            <div>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'All Districts' : `${d} District`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
              >
                {ASSET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === 'All' ? 'All Asset Types' : t}
                  </option>
                ))}
              </select>
            </div>

            {selectedReport !== 'critical' && (
              <div>
                <select
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
                >
                  <option value="All">All Conditions</option>
                  <option value="Excellent">Excellent Condition</option>
                  <option value="Good">Good Condition</option>
                  <option value="Fair">Fair Condition</option>
                  <option value="Poor">Poor Condition</option>
                  <option value="Critical">Critical Condition</option>
                </select>
              </div>
            )}
          </>
        )}

        <div className="ml-auto text-xs text-slate-500 font-medium">
          Generated Records: <strong className="text-slate-800">{data.length}</strong>
        </div>
      </div>

      {/* Report Data Table */}
      {loading ? (
        <LoadingSpinner text="Compiling verified report records..." />
      ) : data.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-card">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No Records Match Current Report Criteria</h4>
          <p className="text-xs text-slate-400 mt-1">Adjust the filter parameters above to re-generate the report.</p>
        </div>
      ) : selectedReport === 'maintenance' ? (
        /* SPECIALIZED MAINTENANCE & EXPENDITURE AUDIT TABLE */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Asset ID & Location</th>
                <th className="py-3.5 px-4">Maintenance Scope & Type</th>
                <th className="py-3.5 px-4">Work Status</th>
                <th className="py-3.5 px-4">Contractor / Agency</th>
                <th className="py-3.5 px-4">Est. Budget (₹)</th>
                <th className="py-3.5 px-4">Actual Cost (₹)</th>
                <th className="py-3.5 px-4">Work Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {data.map((m) => {
                const assetObj = typeof m.assetId === 'object' ? m.assetId : null;
                const assetCode = assetObj ? assetObj.assetId : (m.assetId || 'N/A');
                const assetName = assetObj ? assetObj.assetName : 'Infrastructure Asset';
                const assetDistrict = assetObj ? assetObj.district : '';

                return (
                  <tr key={m._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                          {assetCode}
                        </span>
                        {assetObj?.assetType && <AssetTypeBadge type={assetObj.assetType} size="xs" />}
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-1">{assetName}</div>
                      {assetDistrict && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{assetDistrict} District</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold text-slate-900 block">{m.maintenanceType}</span>
                      <p className="text-[11px] text-slate-500 max-w-xs line-clamp-2 mt-0.5">
                        {m.description || 'No description recorded'}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          m.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : m.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            m.status === 'Completed'
                              ? 'bg-emerald-500'
                              : m.status === 'In Progress'
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-blue-500'
                          }`}
                        />
                        {m.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-semibold text-slate-800 block">
                        {m.contractor || 'Departmental Direct'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono font-semibold text-slate-700">
                      ₹{(m.estimatedCost || 0).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono font-bold text-slate-900">
                      {m.actualCost ? `₹${Number(m.actualCost).toLocaleString()}` : <span className="text-slate-400 font-normal">Pending</span>}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {m.maintenanceDate ? new Date(m.maintenanceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/assets/${assetCode || (assetObj ? assetObj._id : m.assetId)}`)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <span>View Asset</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* INFRASTRUCTURE ASSETS REPORT TABLE */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Asset ID & Name</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">District / Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Condition</th>
                <th className="py-3.5 px-4">Valuation (₹)</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {data.map((item) => {
                const assetCode = typeof item.assetId === 'object' ? item.assetId?.assetId : item.assetId;
                const assetName = item.assetName || (typeof item.assetId === 'object' ? item.assetId?.assetName : '');

                return (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 mr-2">
                        {assetCode}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{assetName}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <AssetTypeBadge type={item.assetType} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-semibold text-slate-800">{item.district}</span>
                      <span className="text-slate-400 block text-[11px] truncate max-w-xs">{item.location}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <ConditionBadge condition={item.condition} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono font-semibold text-slate-800">
                      ₹{(item.estimatedCost || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/assets/${assetCode || item._id}`)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
