import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Award,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CustomerAuth = ({ defaultTab = 'login', onAuthSuccess }) => {
  const [mode, setMode] = useState(defaultTab); // 'login' | 'register'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        if (onAuthSuccess) onAuthSuccess();
        else navigate('/');
      } else {
        setError(res.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(registerData);
      if (res.success) {
        if (onAuthSuccess) onAuthSuccess();
        else navigate('/');
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    if (mode === 'login') {
      setLoginEmail('customer@gmail.com');
      setLoginPassword('Customer@123');
    } else {
      setRegisterData({
        name: 'Kavitha Ramasamy',
        email: `kavitha.${Date.now().toString().slice(-4)}@gmail.com`,
        phone: '9842155678',
        password: 'Customer@123',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-brand-300/25 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-warmOrange/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-500 to-jaggery-800 text-white flex items-center justify-center text-3xl mx-auto shadow-lg transform hover:scale-105 transition-transform duration-300">
          🥜
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-jaggery-900 tracking-tight">
          Kadalai <span className="text-brand-600">Mittai</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-jaggery-600 tracking-wide">
          Authentic Kovilpatti Groundnut Candy Store
        </p>
        <p className="text-xs text-jaggery-500 max-w-xs mx-auto">
          Please sign in or create an account to access our fresh daily roasted candy collections.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white rounded-3xl shadow-warm border border-jaggery-100 p-6 sm:p-8 space-y-6">
          {/* Tabs: Sign In / Create Account */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-cream-100 border border-jaggery-100 text-xs font-bold">
            <button
              type="button"
              id="auth-tab-signin"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2.5 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-jaggery-800 text-white shadow-sm'
                  : 'text-jaggery-600 hover:text-jaggery-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="auth-tab-signup"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2.5 rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-jaggery-800 text-white shadow-sm'
                  : 'text-jaggery-600 hover:text-jaggery-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-jaggery-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-jaggery-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    id="customer-login-email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
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
                    id="customer-login-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="customer-login-submit"
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-jaggery-800 hover:from-brand-700 hover:to-jaggery-900 text-white font-bold text-sm shadow-warm transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Enter Kadalai Mittai Store</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-jaggery-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-jaggery-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    id="customer-register-name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
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
                    required
                    id="customer-register-email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
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
                    required
                    id="customer-register-phone"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
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
                    required
                    id="customer-register-password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="customer-register-submit"
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-jaggery-800 hover:from-brand-700 hover:to-jaggery-900 text-white font-bold text-sm shadow-warm transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create Account & Start Shopping</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Helper */}
          <div className="p-3.5 rounded-2xl bg-cream-100 border border-jaggery-100 flex items-center justify-between text-xs">
            <span className="text-jaggery-700 font-medium">Quick Demo Testing?</span>
            <button
              type="button"
              onClick={handleDemoFill}
              id="customer-demo-autofill"
              className="px-3 py-1 rounded-lg bg-brand-500 hover:bg-brand-600 text-jaggery-900 font-bold transition-colors flex items-center gap-1 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" /> Auto Fill Demo
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-2 border-t border-jaggery-100 grid grid-cols-2 gap-2 text-[11px] text-jaggery-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span>Purchase Tracking</span>
            </div>
          </div>
        </div>

        {/* Admin Link at the very bottom */}
        <div className="text-center mt-6">
          <a
            href="/admin/login"
            className="text-xs text-jaggery-500 hover:text-brand-700 font-medium transition-colors"
          >
            Looking for Store Admin Dashboard? Click here →
          </a>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuth;
