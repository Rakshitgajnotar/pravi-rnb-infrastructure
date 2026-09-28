import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  title = 'No Assets Found',
  description = 'Try adjusting your search criteria, clearing filters, or create a new asset.',
  actionText,
  onAction,
  icon: Icon = PackageOpen,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/50 my-4">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm hover:shadow transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
