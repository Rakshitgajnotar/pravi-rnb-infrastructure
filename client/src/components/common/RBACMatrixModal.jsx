import React from 'react';
import {
  Shield,
  Search,
  HardHat,
  Eye,
  Check,
  X as CloseIcon,
  Lock,
  Layers,
  FileCheck,
} from 'lucide-react';
import RoleBadge from './RoleBadge';

const PERMISSIONS_MATRIX = [
  {
    feature: 'Register New Infrastructure Asset',
    scope: 'Add State Roads, Bridges, Flyovers, Culverts, Buildings',
    admin: true,
    inspector: false,
    contractor: false,
    auditor: false,
  },
  {
    feature: 'Modify Technical Specifications',
    scope: 'Update carriageway width, surface type, floor area, chainage',
    admin: true,
    inspector: false,
    contractor: false,
    auditor: false,
  },
  {
    feature: 'Decommission / Delete Asset',
    scope: 'Permanently remove or decommission public infrastructure',
    admin: true,
    inspector: false,
    contractor: false,
    auditor: false,
  },
  {
    feature: 'Conduct Field Inspections',
    scope: 'Log structural observations, wear & tear, site photographs',
    admin: true,
    inspector: true,
    contractor: false,
    auditor: false,
  },
  {
    feature: 'Grade Condition (Critical / Poor / Fair)',
    scope: 'Reclassify structural safety rating on the master record',
    admin: true,
    inspector: true,
    contractor: false,
    auditor: false,
  },
  {
    feature: 'Execute Maintenance Work Orders',
    scope: 'Mark repairs in progress, log actual expenses, record completion',
    admin: true,
    inspector: false,
    contractor: true,
    auditor: false,
  },
  {
    feature: 'Restore Asset to Active Operational Status',
    scope: 'Transition asset from Under Maintenance to Active',
    admin: true,
    inspector: false,
    contractor: true,
    auditor: false,
  },
  {
    feature: 'Statewide Inventory Oversight',
    scope: 'View all assets, locations, districts, and technical specs',
    admin: true,
    inspector: true,
    contractor: true,
    auditor: true,
  },
  {
    feature: 'Lifecycle Audit Trail Inspection',
    scope: 'Review chronological history and previous condition states',
    admin: true,
    inspector: true,
    contractor: true,
    auditor: true,
  },
  {
    feature: 'Executive Reports & CSV Data Export',
    scope: 'Download ministerial spreadsheets and financial summaries',
    admin: true,
    inspector: true,
    contractor: true,
    auditor: true,
  },
];

export default function RBACMatrixModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500/20 rounded-xl border border-brand-500/30 text-brand-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">
                Government R&B Role-Based Access Control (RBAC) Matrix
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Official departmental separation of duties enforced across the platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Table */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-extrabold text-slate-700">Infrastructure Operation / Feature</th>
                  <th className="py-3.5 px-3 text-center">
                    <span className="block font-bold text-purple-700">Executive Engineer</span>
                    <span className="text-[10px] text-purple-500 font-semibold">(Admin)</span>
                  </th>
                  <th className="py-3.5 px-3 text-center">
                    <span className="block font-bold text-blue-700">Field Inspector</span>
                    <span className="text-[10px] text-blue-500 font-semibold">(Inspector)</span>
                  </th>
                  <th className="py-3.5 px-3 text-center">
                    <span className="block font-bold text-amber-700">Maintenance Contractor</span>
                    <span className="text-[10px] text-amber-500 font-semibold">(Contractor)</span>
                  </th>
                  <th className="py-3.5 px-3 text-center">
                    <span className="block font-bold text-emerald-700">State Auditor</span>
                    <span className="text-[10px] text-emerald-500 font-semibold">(Auditor)</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {PERMISSIONS_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block text-xs">{row.feature}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{row.scope}</span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {row.admin ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {row.inspector ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {row.contractor ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {row.auditor ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Enforcement Guarantee:</strong> When an unauthorized role attempts a restricted action (e.g., an Auditor attempting asset deletion or an Inspector attempting maintenance sign-off), the application suppresses the action in the UI and the MongoDB Express backend returns a strict <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">403 Forbidden</code> response.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            PRAVI R&B Security Specification v2.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors shadow-sm"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
