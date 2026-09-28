import React from 'react';
import {
  Eye,
  Edit3,
  Trash2,
  MapPin,
  Calendar,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import ConditionBadge from '../common/ConditionBadge';
import AssetTypeBadge from '../common/AssetTypeBadge';
import EmptyState from '../common/EmptyState';
import { useAuth } from '../../context/AuthContext';

export default function AssetTable({
  assets = [],
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
  onClearFilters,
}) {
  const { can } = useAuth();

  if (!assets || assets.length === 0) {
    return (
      <EmptyState
        title="No infrastructure assets found"
        description="Try adjusting your search criteria, type, district, or condition filters."
        onAction={onClearFilters}
        actionText="Reset All Filters"
      />
    );
  }

  const renderSortIndicator = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1 inline opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return (
      <span className="text-brand-600 font-bold ml-1">
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-card">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <th
              className="py-3.5 px-4 sm:px-6 cursor-pointer hover:text-slate-900 group select-none"
              onClick={() => onSort && onSort('assetId')}
            >
              <span>Asset ID</span>
              {renderSortIndicator('assetId')}
            </th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:text-slate-900 group select-none"
              onClick={() => onSort && onSort('assetName')}
            >
              <span>Infrastructure Asset Name</span>
              {renderSortIndicator('assetName')}
            </th>
            <th className="py-3.5 px-4">Type</th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:text-slate-900 group select-none"
              onClick={() => onSort && onSort('district')}
            >
              <span>District</span>
              {renderSortIndicator('district')}
            </th>
            <th className="py-3.5 px-4">Location / Corridor</th>
            <th className="py-3.5 px-4">Status</th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:text-slate-900 group select-none"
              onClick={() => onSort && onSort('condition')}
            >
              <span>Condition</span>
              {renderSortIndicator('condition')}
            </th>
            <th className="py-3.5 px-4">Last Inspection</th>
            <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
          {assets.map((asset) => (
            <tr
              key={asset._id || asset.assetId}
              className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
            >
              {/* Asset ID */}
              <td
                className="py-4 px-4 sm:px-6 font-mono text-xs font-bold text-brand-700"
                onClick={() => onView && onView(asset)}
              >
                <div className="flex items-center gap-1.5">
                  <span className="bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {asset.assetId}
                  </span>
                </div>
              </td>

              {/* Asset Name */}
              <td
                className="py-4 px-4 font-semibold text-slate-900"
                onClick={() => onView && onView(asset)}
              >
                <span className="hover:text-brand-600 transition-colors line-clamp-1">
                  {asset.assetName}
                </span>
                {asset.constructionYear && (
                  <span className="block text-[11px] font-normal text-slate-400 mt-0.5">
                    Built: {asset.constructionYear} • {asset.ownership || 'Government'}
                  </span>
                )}
              </td>

              {/* Asset Type */}
              <td className="py-4 px-4" onClick={() => onView && onView(asset)}>
                <AssetTypeBadge type={asset.assetType} />
              </td>

              {/* District */}
              <td className="py-4 px-4 text-xs font-semibold text-slate-800" onClick={() => onView && onView(asset)}>
                {asset.district}
                {asset.taluka && (
                  <span className="block text-[11px] font-normal text-slate-400">
                    {asset.taluka}
                  </span>
                )}
              </td>

              {/* Location */}
              <td className="py-4 px-4 text-xs text-slate-600" onClick={() => onView && onView(asset)}>
                <div className="flex items-center gap-1.5 truncate max-w-[190px]" title={asset.location}>
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{asset.location}</span>
                </div>
              </td>

              {/* Operational Status */}
              <td className="py-4 px-4" onClick={() => onView && onView(asset)}>
                <StatusBadge status={asset.status} />
              </td>

              {/* Physical Condition */}
              <td className="py-4 px-4" onClick={() => onView && onView(asset)}>
                <ConditionBadge condition={asset.condition} />
              </td>

              {/* Last Inspection / Audit */}
              <td className="py-4 px-4 text-xs text-slate-500" onClick={() => onView && onView(asset)}>
                {asset.lastInspectionDate ? (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(asset.lastInspectionDate).toLocaleDateString()}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">Pending Audit</span>
                )}
              </td>

              {/* Actions (Role-Based Permissions) */}
              <td className="py-4 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                  <button
                    onClick={() => onView && onView(asset)}
                    title="View Detailed Asset Profile"
                    className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {can('canEditAsset') && (
                    <button
                      onClick={() => onEdit && onEdit(asset)}
                      title="Edit Asset Information (Admin only)"
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}

                  {can('canDeleteAsset') && (
                    <button
                      onClick={() => onDelete && onDelete(asset)}
                      title="Delete Asset (Executive Engineer only)"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
