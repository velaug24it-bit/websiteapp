import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, CreditCard, Smartphone, Building, Lock } from 'lucide-react';

const RazorpayModal = ({ isOpen, onClose, orderData, onSuccess, onFailure }) => {
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('customer@oksbi');
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !orderData) return null;

  const totalAmount = (orderData.amount / 100).toFixed(2);

  const handleSimulatePayment = (success = true) => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (success) {
        const paymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        onSuccess({
          razorpay_order_id: orderData.razorpayOrderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: `sim_sig_${Date.now()}`,
        });
      } else {
        onFailure('Payment was cancelled or failed by bank.');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100 animate-scaleUp">
        {/* Razorpay Brand Header */}
        <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-inner">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-wide">Razorpay</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded font-mono uppercase">
                  Test Mode
                </span>
              </div>
              <p className="text-xs text-blue-200">Kadalai Mittai Artisanal Store</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-blue-300">Amount to Pay</span>
            <p className="text-xl font-black text-white font-mono">₹{totalAmount}</p>
          </div>
        </div>

        {/* Security badge */}
        <div className="bg-blue-50/70 px-5 py-2 flex items-center justify-between text-xs text-blue-800 border-b border-blue-100">
          <span className="flex items-center gap-1 font-medium">
            <Lock className="w-3.5 h-3.5 text-blue-600" /> 256-Bit Encrypted Sandbox
          </span>
          <span className="font-mono text-[11px] text-blue-600">{orderData.razorpayOrderId}</span>
        </div>

        {/* Payment Methods */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-jaggery-500">Select Payment Method</p>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setMethod('upi')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                method === 'upi'
                  ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-bold shadow-xs'
                  : 'border-jaggery-100 text-jaggery-700 hover:bg-cream-100'
              }`}
            >
              <Smartphone className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <span className="text-xs">UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('card')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                method === 'card'
                  ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-bold shadow-xs'
                  : 'border-jaggery-100 text-jaggery-700 hover:bg-cream-100'
              }`}
            >
              <CreditCard className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <span className="text-xs">Card</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('netbanking')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                method === 'netbanking'
                  ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-bold shadow-xs'
                  : 'border-jaggery-100 text-jaggery-700 hover:bg-cream-100'
              }`}
            >
              <Building className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <span className="text-xs">NetBanking</span>
            </button>
          </div>

          {/* Form details mock */}
          <div className="bg-cream-100 rounded-2xl p-3 border border-jaggery-100">
            {method === 'upi' && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-jaggery-600">Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-jaggery-200 rounded-xl px-3 py-2 text-jaggery-900 focus:outline-hidden focus:border-blue-500"
                />
                <p className="text-[10px] text-jaggery-500">Simulated test VPA (GPay / PhonePe / Paytm / BHIM)</p>
              </div>
            )}
            {method === 'card' && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-jaggery-600">Test Card Number</label>
                <input
                  type="text"
                  readOnly
                  value="4111 •••• •••• 1111 (Test Card)"
                  className="w-full text-xs font-mono bg-white border border-jaggery-200 rounded-xl px-3 py-2 text-jaggery-900"
                />
              </div>
            )}
            {method === 'netbanking' && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-jaggery-600">Popular Bank</label>
                <select className="w-full text-xs bg-white border border-jaggery-200 rounded-xl px-3 py-2 text-jaggery-900">
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}
          </div>

          {/* Trigger Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              id="razorpay-simulate-success-btn"
              disabled={processing}
              onClick={() => handleSimulatePayment(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {processing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Complete Successful Payment (₹{totalAmount})
                </>
              )}
            </button>

            <button
              type="button"
              disabled={processing}
              onClick={() => handleSimulatePayment(false)}
              className="w-full py-2.5 px-4 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" /> Simulate Failed / Cancelled Payment
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> PCI-DSS Compliant Test Gateway
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 font-semibold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RazorpayModal;
