import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  asset,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">Confirm Deletion</h3>
              <p className="text-xs text-slate-500">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            Are you sure you want to permanently delete this asset from the inventory?
          </p>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl mb-4">
            <div className="text-xs font-semibold text-brand-600 font-mono mb-1">
              {asset.assetId}
            </div>
            <div className="text-sm font-semibold text-slate-800">{asset.assetName}</div>
            <div className="text-xs text-slate-500 mt-1">
              {asset.category} • {asset.location}
            </div>
          </div>

          <p className="text-xs text-rose-500 font-medium">
            Warning: Removing this asset will erase all assigned warranty and lifecycle records.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 bg-slate-50/80 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(asset)}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>{isDeleting ? 'Deleting...' : 'Delete Asset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
