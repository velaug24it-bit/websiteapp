import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Invalid login credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('customer@gmail.com');
    setPassword('Customer@123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-warm border border-jaggery-100 space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-jaggery-800 text-white flex items-center justify-center text-2xl mx-auto shadow-md">
            🥜
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-jaggery-900">Welcome Back</h1>
          <p className="text-xs text-jaggery-600">Sign in to your Kadalai Mittai account to track orders & reorder.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-jaggery-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-jaggery-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                id="login-email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@gmail.com"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-jaggery-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-jaggery-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                id="login-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="login-submit-btn"
            className="w-full py-3.5 px-4 rounded-2xl bg-jaggery-800 hover:bg-jaggery-900 text-white font-bold text-sm shadow-warm transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Account Auto-Fill */}
        <div className="p-3 rounded-2xl bg-cream-100 border border-jaggery-100 flex items-center justify-between text-xs">
          <span className="text-jaggery-600 font-medium">Demo Customer credentials?</span>
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-brand-700 font-bold hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Auto Fill
          </button>
        </div>

        <div className="text-center text-xs text-jaggery-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-700 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
