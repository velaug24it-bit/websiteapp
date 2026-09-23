import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminProfile = () => {
  const { admin, updateProfile } = useAdminAuth();

  const [formData, setFormData] = useState({
    name: admin?.name || 'Kadalai Mittai Admin',
    email: admin?.email || 'admin@kadalaicandy.com',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(null);
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      const res = await updateProfile(payload);
      if (res.success) {
        setNotice({ type: 'success', msg: 'Admin profile updated successfully.' });
        setFormData((prev) => ({ ...prev, password: '' }));
      } else {
        setNotice({ type: 'error', msg: res.message || 'Update failed.' });
      }
    } catch (err) {
      setNotice({ type: 'error', msg: err.response?.data?.message || 'Update failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="font-serif text-3xl font-bold text-white tracking-tight">Admin Profile & Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your administrator credentials and security preferences.
        </p>
      </div>

      {notice && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn ${
            notice.type === 'error'
              ? 'bg-rose-950/60 border border-rose-800 text-rose-300'
              : 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
          }`}
        >
          {notice.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{notice.msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Administrator Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-medium text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-medium text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            New Password (leave blank to keep current)
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-medium text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Update Admin Credentials'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
