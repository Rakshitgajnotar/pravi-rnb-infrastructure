import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  Database,
  Shield,
  Wrench,
  FileText,
  Landmark,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function Sidebar({ onOpenAddModal, dbInfo }) {
  const { currentUser, can, logout } = useAuth();
  const navItems = [
    {
      to: '/',
      name: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/assets',
      name: 'Infrastructure Assets',
      icon: Boxes,
      badge: 'Statewide',
    },
    {
      to: '/maintenance',
      name: 'Maintenance',
      icon: Wrench,
      badge: 'Active',
    },
    {
      to: '/reports',
      name: 'Reports & Audits',
      icon: FileText,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-800 z-30 hidden md:flex select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800/80 bg-slate-950/60">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-glow-brand">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
              <span>PRAVI</span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                GOVT R&B
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Roads & Buildings Dept</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Operations & Oversight
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer / Status */}
      <div className="p-4 space-y-3 border-t border-slate-800/80 bg-slate-950/30">
        {can('canCreateAsset') && onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-600/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Register Asset</span>
          </button>
        )}

        {/* Active Official Card & Logout */}
        {currentUser && (
          <div className="p-2.5 rounded-xl bg-slate-850/90 border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'RB'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-brand-400 font-semibold truncate capitalize">{currentUser.role} • {currentUser.division || 'Gujarat'}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              title="Log Out of Session"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Database Status */}
        <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-brand-400" />
              State Database
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono truncate" title={dbInfo?.mode || 'Connected'}>
            {dbInfo?.mode ? dbInfo.mode.replace(' (Zero-Config Dev Mode)', '') : 'MongoDB Active'}
          </div>
        </div>
      </div>
    </aside>
  );
}
