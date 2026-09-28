import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Landmark,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Search,
  HardHat,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import RoleBadge from '../components/common/RoleBadge';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, availableUsers } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Government of Gujarat | Roads & Buildings (R&B) Department';
  }, []);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide your official email and security password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await login({ email: email.trim(), password });
      showToast(res.message || 'Authenticated successfully!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid official credentials. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (user) => {
    try {
      setLoading(true);
      setError('');
      const res = await login({ email: user.email, password: 'rnb@123', role: user.role });
      showToast(`Logged in as ${user.name} (${user.designation})`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <Shield className="w-4 h-4 text-purple-600" />;
      case 'Inspector':
        return <Search className="w-4 h-4 text-blue-600" />;
      case 'Contractor':
        return <HardHat className="w-4 h-4 text-amber-600" />;
      case 'Auditor':
        return <Eye className="w-4 h-4 text-emerald-600" />;
      default:
        return <Landmark className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-brand-950 flex flex-col justify-between p-4 sm:p-8 text-slate-100">
      {/* Top Government Banner */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-glow-brand">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                GOVERNMENT OF GUJARAT
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">Roads & Buildings (R&B) Department</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>SSL 256-Bit Encrypted Portal</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-4xl mx-auto w-full my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Department Overview */}
        <div className="lg:col-span-6 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>State Infrastructure Asset Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Centralized Asset Inventory & Lifecycle Governance System
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Secure digital repository for state highways, bridges, flyovers, culverts, and administrative government buildings. Access is strictly restricted to authorized department engineers and certified audit officials.
          </p>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full lifecycle audit trail from construction to decommissioning</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time structural condition grading & maintenance dispatch</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Strict Role-Based Access Control (RBAC) enforced on MongoDB</span>
            </div>
          </div>
        </div>

        {/* Right: Login Box */}
        <div className="lg:col-span-6 bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Official Department Sign In
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your government credentials or use instant official demo access
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@rnb.gujarat.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Default: rnb@123</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating with Department Server...' : 'Secure Official Login'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Official Access */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              1-Click Demo Official Access (For Evaluators):
            </span>

            <div className="grid grid-cols-2 gap-2">
              {availableUsers.map((user) => (
                <button
                  key={user.role}
                  type="button"
                  onClick={() => handleQuickLogin(user)}
                  disabled={loading}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50/50 bg-slate-50/80 text-left transition-all group flex items-start gap-2"
                >
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shrink-0 group-hover:border-brand-300">
                    {getRoleIcon(user.role)}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-extrabold text-slate-900 block truncate group-hover:text-brand-700">
                      {user.name.split(' ')[0]} {user.name.split(' ')[1] || ''}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 block truncate">
                      {user.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Security Notice */}
      <div className="max-w-5xl mx-auto w-full text-center text-[11px] text-slate-400 space-y-1">
        <p>Roads & Buildings Department • Government of Gujarat • Infrastructure Asset & Lifecycle System</p>
        <p className="text-[10px] text-slate-500">
          Access restricted to certified state personnel. All sessions and audit activities are permanently logged.
        </p>
      </div>
    </div>
  );
}
