import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-warm border border-jaggery-100 space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-jaggery-800 text-white flex items-center justify-center text-2xl mx-auto shadow-md">
            🥜
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-jaggery-900">Create Account</h1>
          <p className="text-xs text-jaggery-600">Join the Kadalai Mittai family for fresh batch updates & expedited checkout.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-jaggery-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-jaggery-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                required
                id="register-name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rajesh Kumar"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-jaggery-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-jaggery-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                required
                id="register-email"
                value={formData.email}
                onChange={handleChange}
                placeholder="rajesh@gmail.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-jaggery-700 mb-1">Mobile Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-jaggery-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                required
                id="register-phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-jaggery-700 mb-1">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-jaggery-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                required
                id="register-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="register-submit-btn"
            className="w-full py-3.5 px-4 rounded-2xl bg-jaggery-800 hover:bg-jaggery-900 text-white font-bold text-sm shadow-warm transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Create Customer Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-jaggery-600">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-700 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
