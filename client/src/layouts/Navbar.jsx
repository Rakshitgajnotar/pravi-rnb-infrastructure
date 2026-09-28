import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  RefreshCw,
  Landmark,
  Database,
  Menu,
  X,
  LayoutDashboard,
  Boxes,
  Wrench,
  FileText,
  UserCheck,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import RoleSwitcherModal from '../components/common/RoleSwitcherModal';
import RoleBadge from '../components/common/RoleBadge';

export default function Navbar({ onOpenAddModal, onReseed, isReseeding, dbInfo }) {
  const [searchInput, setSearchInput] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const { currentUser, can, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/assets?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/assets');
    }
  };

  const handleRoleChanged = (newRole) => {
    showToast(`Switched active official role to ${currentUser.name} (${newRole})`, 'info');
  };

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-sm">
        {/* Mobile Brand & Menu */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Landmark className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-slate-900 tracking-tight">PRAVI R&B</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center flex-1 max-w-md mr-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search state roads, bridges, culverts, or buildings... (Press Enter)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
        </form>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Reset Demo Data Button */}
          {onReseed && (
            <button
              onClick={onReseed}
              disabled={isReseeding}
              title="Reset sample R&B presentation records"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isReseeding ? 'animate-spin' : ''}`} />
              <span>{isReseeding ? 'Resetting...' : 'Reset Demo'}</span>
            </button>
          )}

          {/* Database Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[130px]">
              {dbInfo?.mode ? dbInfo.mode.replace(' (Zero-Config Dev Mode)', '') : 'MongoDB Online'}
            </span>
          </div>

          {/* Register Asset Button (Controlled by RBAC) */}
          {can('canCreateAsset') && onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-sm hover:shadow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Asset</span>
            </button>
          )}

          {/* RBAC Role Switcher Pill & Officer Avatar */}
          <button
            onClick={() => setRoleModalOpen(true)}
            className="flex items-center gap-2 pl-2 sm:pl-3 pr-2.5 py-1 rounded-2xl border border-slate-200 hover:border-brand-300 bg-slate-50/80 hover:bg-white transition-all shadow-sm group"
            title="Click to switch government official role (RBAC)"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-700 text-white font-extrabold text-[11px] flex items-center justify-center shadow-sm">
              {currentUser?.name
                ?.split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('') || 'RB'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight truncate max-w-[120px]">
                {currentUser?.name || 'Er. Rajesh Patel'}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <RoleBadge role={currentUser?.role} size="xs" />
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>

          {/* Official Logout Button */}
          <button
            onClick={() => {
              logout();
              showToast('Logged out of official department session.', 'info');
              navigate('/login');
            }}
            title="Log out of Official Session"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-200"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 p-4 shadow-xl space-y-3 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search infrastructure..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 rounded-xl border border-slate-200"
              />
            </form>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Active Official:</span>
                <span className="text-xs font-bold text-slate-900">{currentUser?.name}</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setRoleModalOpen(true);
                }}
                className="text-xs font-bold text-brand-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm"
              >
                Switch Role
              </button>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  location.pathname === '/' ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-700'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => {
                  navigate('/assets');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  location.pathname.startsWith('/assets') ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-700'
                }`}
              >
                <Boxes className="w-4 h-4" />
                <span>Infrastructure Assets</span>
              </button>
              <button
                onClick={() => {
                  navigate('/maintenance');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  location.pathname === '/maintenance' ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-700'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Maintenance Operations</span>
              </button>
              <button
                onClick={() => {
                  navigate('/reports');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  location.pathname === '/reports' ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Reports & Audits</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  showToast('Logged out of official department session.', 'info');
                  navigate('/login');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 mt-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Session</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onRoleChanged={handleRoleChanged}
      />
    </>
  );
}
