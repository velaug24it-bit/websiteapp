import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { forgotPasswordApi, resetPasswordApi } from '../services/api';

const ForgotPasswordModal = ({
  isOpen,
  onClose,
  initialEmail = '',
  onSuccess,
  isDark = false,
}) => {
  // Step 1: 'email', Step 2: 'otp_password', Step 3: 'success'
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Sync initialEmail when opened
  useEffect(() => {
    if (isOpen) {
      if (initialEmail) setEmail(initialEmail);
      setError(null);
    } else {
      // Reset state on close
      setStep('email');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
    }
  }, [isOpen, initialEmail]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Handle Step 1: Send OTP to Email
  const handleSendCode = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordApi({ email: cleanEmail });
      if (res.data?.success) {
        setOtp('');
        setStep('otp_password');
        setResendCooldown(30);
      } else {
        setError(res.data?.message || 'Failed to send reset code.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(
        err.response?.data?.message || 'No account found with this email. Please check your spelling.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);

    if (!otp || otp.trim().length < 4) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-check.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordApi({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });

      if (res.data?.success) {
        setSuccessInfo({
          email: email.trim().toLowerCase(),
          newPassword,
          accountType: res.data.accountType,
          user: res.data.user,
        });
        setStep('success');
      } else {
        setError(res.data?.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError(
        err.response?.data?.message || 'Invalid or expired verification code. Please request a new one.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    if (onSuccess && successInfo) {
      onSuccess(successInfo);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div
        className={`relative w-full max-w-md rounded-3xl shadow-2xl border overflow-hidden transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-jaggery-100 text-jaggery-900'
        }`}
      >
        {/* Top Accent / Header */}
        <div
          className={`p-6 flex items-start justify-between ${
            isDark
              ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-white'
              : 'bg-gradient-to-r from-brand-600 to-jaggery-800 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shadow-inner">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">
                {step === 'success'
                  ? 'Password Reset'
                  : step === 'otp_password'
                  ? 'Enter Code & New Password'
                  : 'Forgot Password'}
              </h3>
              <p className="text-xs text-white/80">
                {step === 'success'
                  ? 'Your credentials have been updated'
                  : step === 'otp_password'
                  ? 'Verify identity and set a new password'
                  : 'Quick & secure account recovery'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/15 transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: ENTER EMAIL */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-jaggery-600'}`}>
                Enter the email address registered with your account. We will send you a 6-digit security code to reset your password.
              </p>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-jaggery-700'}`}>
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail
                    className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-slate-500' : 'text-jaggery-400'
                    }`}
                  />
                  <input
                    type="email"
                    required
                    id="forgot-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. customer@gmail.com"
                    autoFocus
                    className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium border transition-colors focus:outline-hidden ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                        : 'bg-cream-50 border-jaggery-200 text-jaggery-900 focus:border-brand-500 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !email}
                  id="forgot-submit-email-btn"
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 ${
                    isDark
                      ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                      : 'bg-gradient-to-r from-brand-600 to-jaggery-800 hover:from-brand-700 hover:to-jaggery-900 text-white'
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className={`text-xs font-semibold hover:underline ${
                    isDark ? 'text-slate-400 hover:text-slate-200' : 'text-jaggery-500 hover:text-jaggery-800'
                  }`}
                >
                  Cancel and Return to Login
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: ENTER OTP & NEW PASSWORD */}
          {step === 'otp_password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Target email badge with change button */}
              <div
                className={`p-3 rounded-2xl flex items-center justify-between text-xs border ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-300'
                    : 'bg-cream-50 border-jaggery-200 text-jaggery-700'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden pr-2">
                  <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="font-semibold truncate">{email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setError(null);
                  }}
                  className="text-brand-600 hover:underline font-bold text-[11px] shrink-0"
                >
                  Change
                </button>
              </div>

              {/* Email Sent Notification Box */}
              <div
                className={`p-3.5 rounded-2xl flex items-center gap-3 text-xs border ${
                  isDark
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-brand-50 border-brand-200 text-brand-900'
                }`}
              >
                <Mail className="w-5 h-5 text-brand-600 shrink-0" />
                <p className="leading-relaxed">
                  A 6-digit verification code has been sent to your email. Please check your inbox (and spam folder) and enter it below.
                </p>
              </div>

              {/* 6-Digit OTP */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-jaggery-700'}`}>
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleSendCode}
                    className={`text-[11px] font-bold flex items-center gap-1 ${
                      resendCooldown > 0
                        ? 'opacity-50 cursor-not-allowed text-slate-500'
                        : 'text-brand-600 hover:underline'
                    }`}
                  >
                    <RotateCcw className="w-3 h-3" />
                    {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Code'}
                  </button>
                </div>

                <div className="relative">
                  <KeyRound
                    className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-slate-500' : 'text-jaggery-400'
                    }`}
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    id="forgot-otp-input"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    className={`w-full pl-11 pr-4 py-3 tracking-widest text-center text-base font-mono font-bold rounded-2xl border transition-colors focus:outline-hidden ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                        : 'bg-cream-50 border-jaggery-200 text-jaggery-900 focus:border-brand-500 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-jaggery-700'}`}>
                  New Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock
                    className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-slate-500' : 'text-jaggery-400'
                    }`}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    id="forgot-new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={`w-full pl-11 pr-11 py-3 rounded-2xl text-sm font-medium border transition-colors focus:outline-hidden ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                        : 'bg-cream-50 border-jaggery-200 text-jaggery-900 focus:border-brand-500 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-jaggery-700'}`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock
                    className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-slate-500' : 'text-jaggery-400'
                    }`}
                  />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    id="forgot-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className={`w-full pl-11 pr-11 py-3 rounded-2xl text-sm font-medium border transition-colors focus:outline-hidden ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                        : 'bg-cream-50 border-jaggery-200 text-jaggery-900 focus:border-brand-500 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !otp || !newPassword || !confirmPassword}
                  id="forgot-reset-password-btn"
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 ${
                    isDark
                      ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                      : 'bg-gradient-to-r from-brand-600 to-jaggery-800 hover:from-brand-700 hover:to-jaggery-900 text-white'
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Reset Password Now</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold">Password Reset Successful!</h4>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-jaggery-600'}`}>
                  Your account password for <span className="font-semibold">{successInfo?.email}</span> has been securely updated.
                </p>
              </div>

              <div
                className={`p-3 rounded-2xl text-xs border ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-300'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                You can now log in immediately with your new password.
              </div>

              <button
                type="button"
                id="forgot-success-close-btn"
                onClick={handleFinish}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 ${
                  isDark
                    ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                    : 'bg-gradient-to-r from-brand-600 to-jaggery-800 hover:from-brand-700 hover:to-jaggery-900 text-white'
                }`}
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
