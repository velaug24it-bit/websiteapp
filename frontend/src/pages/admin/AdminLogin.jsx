import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // If already logged in as admin, go to dashboard
  if (isAdminAuthenticated) {
    navigate('/admin/dashboard');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Invalid admin credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@kadalaicandy.com');
    setPassword('Admin@123456');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      {/* Decorative glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-xs text-slate-400">
            Sign in with authorized administrator credentials to manage products, inventory, and orders.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                id="admin-login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kadalaicandy.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-medium text-white focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                id="admin-login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-medium text-white focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="admin-login-submit-btn"
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Enter Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Helper */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Need Demo Admin Login?</span>
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-amber-400 font-bold hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Auto Fill Demo
          </button>
        </div>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">
            ← Return to Customer Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
