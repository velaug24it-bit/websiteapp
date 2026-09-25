import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  X,
  FileText,
  Printer,
  ShieldCheck,
  Zap,
  ArrowRight,
  Radio,
  Lock,
  Sparkles,
  Smartphone,
  Check,
} from 'lucide-react';

// Web Audio API POS sound synthesizer
const playPosTone = (freq = 850, type = 'sine', duration = 0.1) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Sound playback optional if autoplay policy restricts
  }
};

const playApprovalChime = () => {
  playPosTone(587.33, 'triangle', 0.12);
  setTimeout(() => playPosTone(880, 'sine', 0.25), 130);
};

const PosCardSwipeModal = ({
  isOpen,
  onClose,
  orderData,
  customerInfo,
  cartItems = [],
  onSuccess,
  onFailure,
}) => {
  // POS States: 'BILLED_READY' | 'SWIPING' | 'ENTER_PIN' | 'AUTHORIZING' | 'APPROVED'
  const [posState, setPosState] = useState('BILLED_READY');
  const [cardType, setCardType] = useState('RuPay Debit Platinum');
  const [pinDigits, setPinDigits] = useState('');
  const [cardSwiped, setCardSwiped] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [rrnNumber, setRrnNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [activeTab, setActiveTab] = useState('pos'); // 'pos' or 'bill' (on mobile)

  useEffect(() => {
    if (isOpen) {
      setPosState('BILLED_READY');
      setPinDigits('');
      setCardSwiped(false);
      setShowReceipt(false);
      const randomAuth = Math.floor(100000 + Math.random() * 900000).toString();
      const randomRrn = '94' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const inv = orderData?.posInvoiceNo || `INV-KM-${Math.floor(100000 + Math.random() * 900000)}`;
      setAuthCode(randomAuth);
      setRrnNumber(randomRrn);
      setInvoiceNumber(inv);
    }
  }, [isOpen, orderData]);

  if (!isOpen || !orderData) return null;

  const totalAmount = orderData.pricing?.totalAmount || (orderData.amount ? orderData.amount / 100 : 0);
  const subtotal = orderData.pricing?.subtotal || totalAmount;
  const deliveryCharge = orderData.pricing?.deliveryCharge ?? 0;

  // Handle Swipe / Insert
  const handleSwipeCard = () => {
    playPosTone(950, 'sine', 0.09);
    setCardSwiped(true);
    setPosState('SWIPING');

    setTimeout(() => {
      playPosTone(1100, 'sine', 0.12);
      setPosState('ENTER_PIN');
    }, 1200);
  };

  // Keypad clicks
  const handleKeypadPress = (num) => {
    if (posState !== 'ENTER_PIN') return;
    if (pinDigits.length < 4) {
      playPosTone(700 + pinDigits.length * 60, 'sine', 0.07);
      setPinDigits((prev) => prev + num);
    }
  };

  const handleKeypadClear = () => {
    playPosTone(450, 'sawtooth', 0.08);
    setPinDigits('');
  };

  const handleQuickFillPin = () => {
    playPosTone(800, 'sine', 0.08);
    setPinDigits('1234');
  };

  // Submit PIN & Authorize with Bank
  const handleAuthorizePayment = () => {
    if (pinDigits.length !== 4) {
      playPosTone(350, 'sawtooth', 0.2);
      return;
    }

    playPosTone(1000, 'sine', 0.1);
    setPosState('AUTHORIZING');

    setTimeout(() => {
      playApprovalChime();
      setPosState('APPROVED');
      setShowReceipt(true);
    }, 1800);
  };

  // Finalize order and navigate to confirmation status page
  const handleFinishAndConfirmOrder = () => {
    onSuccess({
      razorpay_order_id: orderData.razorpayOrderId || `order_pos_${Date.now()}`,
      razorpay_payment_id: `pay_pos_debit_${Date.now()}`,
      razorpay_signature: 'pos_swipe_verified',
      paymentMethod: 'Debit Card (POS Swipe Machine)',
      posDetails: {
        cardBrand: cardType,
        last4: '4892',
        authCode,
        rrn: rrnNumber,
        invoiceNo: invoiceNumber,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 text-white rounded-3xl shadow-2xl border border-stone-700 overflow-hidden my-4 max-h-[96vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 px-5 py-3.5 border-b border-stone-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold shadow-md shadow-emerald-900/50">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-white">Smart POS Terminal Billing</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> EMV SWIPE ACTIVE
                </span>
              </div>
              <p className="text-xs text-stone-400">Retail Invoice Billed • Swipe Debit Card to Authorize</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-stone-400 uppercase font-medium">Billed Amount</span>
              <p className="text-lg font-black text-emerald-400 font-mono">₹{totalAmount.toFixed(2)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              title="Cancel Transaction"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile View Tab Switcher */}
        <div className="sm:hidden flex border-b border-stone-800 bg-stone-950">
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'pos'
                ? 'border-emerald-500 text-emerald-400 bg-stone-900'
                : 'border-transparent text-stone-400'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            POS Card Machine
          </button>
          <button
            onClick={() => setActiveTab('bill')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 ${
              activeTab === 'bill'
                ? 'border-emerald-500 text-emerald-400 bg-stone-900'
                : 'border-transparent text-stone-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Billed Invoice
          </button>
        </div>

        {/* Modal Main Body (Two Columns on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* LEFT COLUMN: Retail Tax Bill / Invoice ("we need to bill it") */}
          <div
            className={`lg:col-span-5 p-5 bg-stone-950/80 border-r border-stone-800 space-y-4 ${
              activeTab === 'pos' ? 'hidden sm:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-500" /> Retail Store Bill
              </span>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {invoiceNumber}
              </span>
            </div>

            {/* Bill Receipt Card */}
            <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 text-xs space-y-3 font-sans shadow-inner">
              <div className="text-center pb-2 border-b border-dashed border-stone-700">
                <p className="font-serif font-bold text-sm text-stone-100">Kadalai Mittai Artisanal Store</p>
                <p className="text-[10px] text-stone-400">Traditional Kovilpatti Groundnut Sweets</p>
                <p className="text-[9px] text-stone-500 font-mono mt-0.5">FSSAI Lic: 22424589001924 • GSTIN: 33AAACK4812N1Z4</p>
              </div>

              {/* Customer Details */}
              <div className="space-y-1 text-[11px] text-stone-300">
                <div className="flex justify-between">
                  <span className="text-stone-500">Customer:</span>
                  <span className="font-bold text-stone-200">{customerInfo?.name || 'Walk-in Customer'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Phone:</span>
                  <span className="font-mono">{customerInfo?.phone || '9840994649'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Address:</span>
                  <span className="text-right truncate max-w-[180px]">
                    {customerInfo?.shippingAddress?.city || 'Coimbatore'}, {customerInfo?.shippingAddress?.pincode || '641001'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Date & Time:</span>
                  <span className="font-mono">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="pt-2 border-t border-dashed border-stone-700">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-stone-500 border-b border-stone-800">
                      <th className="text-left pb-1">Item</th>
                      <th className="text-center pb-1">Qty</th>
                      <th className="text-right pb-1">Amt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 font-mono">
                    {cartItems.map((item, idx) => (
                      <tr key={idx} className="text-stone-300">
                        <td className="py-1 text-left font-sans text-xs">
                          {item.name} <span className="text-[10px] text-stone-500">({item.weight})</span>
                        </td>
                        <td className="py-1 text-center">{item.quantity}</td>
                        <td className="py-1 text-right text-stone-200">₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="pt-2 border-t border-dashed border-stone-700 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Delivery Charge:</span>
                  <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-emerald-400 pt-1 border-t border-stone-700">
                  <span>Net Billed Amount:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-center">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Bill Generated • Ready for Debit Card Swipe
                </span>
              </div>
            </div>

            {/* Quick Card Brand Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-400 uppercase">Debit Card Network</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'RuPay Debit Platinum',
                  'Visa Platinum Debit',
                  'MasterCard Debit',
                  'SBI Global RuPay',
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      playPosTone(650, 'sine', 0.05);
                      setCardType(c);
                    }}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      cardType === c
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
                        : 'border-stone-800 bg-stone-900 text-stone-400 hover:bg-stone-800'
                    }`}
                  >
                    <div className="text-[11px] font-semibold leading-tight">{c}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Interactive POS Machine Terminal */}
          <div
            className={`lg:col-span-7 p-4 sm:p-6 bg-gradient-to-b from-stone-900 to-stone-950 flex flex-col items-center justify-center space-y-5 ${
              activeTab === 'bill' ? 'hidden sm:flex' : 'flex'
            }`}
          >
            {/* POS Physical Machine Housing */}
            <div className="w-full max-w-md bg-stone-900 rounded-3xl p-5 border-2 border-stone-700 shadow-2xl shadow-black relative overflow-hidden">
              {/* POS Machine Top Thermal Printer Bay */}
              <div className="w-40 h-2 bg-stone-800 rounded-full mx-auto mb-3 shadow-inner border border-stone-700 relative">
                {/* Paper Tear Bar */}
                <div className="absolute inset-0 bg-stone-950/70 rounded-full"></div>
              </div>

              {/* Status Header on POS screen */}
              <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pb-2 border-b border-stone-800">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> 4G LTE CONNECTED
                </span>
                <span className="text-stone-300">MERCHANT: KM-STORE</span>
                <span className="text-emerald-400">BATTERY: 98% 🔋</span>
              </div>

              {/* High-Contrast POS Backlit LCD Screen */}
              <div className="mt-3 bg-[#0a192f] border-2 border-[#1e3a5f] rounded-2xl p-4 text-center font-mono shadow-inner relative overflow-hidden">
                <div className="text-[10px] tracking-wider text-blue-300 uppercase mb-1">
                  Kadalai Mittai POS v2.4 • EMV Chip Terminal
                </div>

                <div className="text-xs text-blue-200 uppercase font-semibold">Total Amount Due</div>
                <div className="text-3xl font-black text-emerald-400 my-1 font-mono tracking-tight">
                  ₹{totalAmount.toFixed(2)}
                </div>

                {/* Dynamic Screen Status Banner */}
                <div className="mt-2 py-1.5 px-3 rounded-lg bg-black/40 border border-blue-900/50">
                  {posState === 'BILLED_READY' && (
                    <p className="text-xs font-bold text-amber-300 uppercase animate-pulse">
                      👉 PLEASE INSERT OR SWIPE DEBIT CARD
                    </p>
                  )}
                  {posState === 'SWIPING' && (
                    <p className="text-xs font-bold text-sky-300 uppercase animate-pulse">
                      ⏳ READING EMV CHIP... DO NOT REMOVE CARD
                    </p>
                  )}
                  {posState === 'ENTER_PIN' && (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-emerald-300 uppercase">
                        ENTER 4-DIGIT ATM PIN & PRESS ENTER
                      </p>
                      <div className="flex justify-center gap-2 pt-1">
                        {[0, 1, 2, 3].map((idx) => (
                          <span
                            key={idx}
                            className={`w-7 h-8 rounded-lg flex items-center justify-center text-lg font-bold border ${
                              pinDigits.length > idx
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                : 'bg-black/60 border-blue-800 text-blue-700'
                            }`}
                          >
                            {pinDigits.length > idx ? '●' : '○'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {posState === 'AUTHORIZING' && (
                    <div className="space-y-1 py-1">
                      <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs font-bold text-emerald-300 uppercase">
                        CONNECTING TO BANK HOST & NPCI SWITCH...
                      </p>
                    </div>
                  )}
                  {posState === 'APPROVED' && (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-emerald-400 uppercase flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        TRANSACTION APPROVED! (AUTH: {authCode})
                      </p>
                      <p className="text-[10px] text-blue-300 font-mono">RRN: {rrnNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Visual Realistic 3D Indian Debit Card Preview */}
              <div className="mt-4">
                <div
                  className={`relative p-4 rounded-2xl text-white shadow-xl transition-all duration-500 transform ${
                    cardSwiped ? 'scale-95 opacity-90' : 'hover:scale-[1.02]'
                  } ${
                    cardType.includes('RuPay')
                      ? 'bg-gradient-to-r from-orange-600 via-amber-700 to-stone-900 border border-amber-500/40'
                      : cardType.includes('Visa')
                      ? 'bg-gradient-to-r from-blue-700 via-indigo-900 to-stone-900 border border-blue-500/40'
                      : 'bg-gradient-to-r from-red-700 via-stone-800 to-stone-900 border border-red-500/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-mono text-amber-200">
                        {cardType}
                      </span>
                      <p className="text-xs font-bold tracking-wider">STATE BANK OF INDIA</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/20 uppercase tracking-wider backdrop-blur-xs">
                      DEBIT CARD
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-3">
                    {/* Golden EMV Chip */}
                    <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 border border-amber-200 shadow-sm flex flex-col justify-center px-1 space-y-1">
                      <div className="w-full h-0.5 bg-amber-800/40"></div>
                      <div className="w-full h-0.5 bg-amber-800/40"></div>
                    </div>
                    {/* Contactless symbol */}
                    <Radio className="w-4 h-4 text-amber-200/80 rotate-90" />
                  </div>

                  <div className="font-mono text-sm tracking-widest font-bold drop-shadow-sm">
                    •••• •••• •••• 4892
                  </div>

                  <div className="flex justify-between items-end mt-2 text-[10px] font-mono text-stone-200">
                    <div>
                      <span className="text-[8px] text-stone-300 uppercase block">CARDHOLDER</span>
                      <span className="font-bold uppercase">{customerInfo?.name || 'VALUED CUSTOMER'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-stone-300 uppercase block">VALID THRU</span>
                      <span>08/29</span>
                    </div>
                  </div>
                </div>

                {/* Swipe Action Trigger */}
                {posState === 'BILLED_READY' && (
                  <button
                    type="button"
                    id="pos-swipe-card-btn"
                    onClick={handleSwipeCard}
                    className="w-full mt-3 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 active:scale-98 animate-pulse"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>👆 Insert / Swipe Debit Card on Machine</span>
                  </button>
                )}
              </div>

              {/* Interactive Hardware Numeric Keypad */}
              {posState === 'ENTER_PIN' && (
                <div className="mt-4 pt-3 border-t border-stone-800 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-stone-400 font-mono text-[11px]">Hardware Pin Pad:</span>
                    <button
                      type="button"
                      onClick={handleQuickFillPin}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" /> Auto-fill PIN: 1234
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 max-w-[260px] mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => handleKeypadPress(n.toString())}
                        className="py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-sm font-mono border border-stone-700 shadow-sm active:bg-stone-600"
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleKeypadClear}
                      className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase font-mono shadow-sm active:scale-95"
                    >
                      CLEAR
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeypadPress('0')}
                      className="py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-sm font-mono border border-stone-700 shadow-sm active:bg-stone-600"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      id="pos-enter-pin-btn"
                      onClick={handleAuthorizePayment}
                      className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase font-mono shadow-sm active:scale-95"
                    >
                      ENTER
                    </button>
                  </div>
                </div>
              )}

              {/* Thermal Paper Slip Output Animation (When Approved) */}
              {showReceipt && (
                <div className="mt-4 pt-3 border-t border-stone-800 animate-slideDown">
                  <div className="bg-stone-100 text-stone-900 rounded-xl p-3.5 font-mono text-[10px] space-y-1 shadow-2xl border border-stone-300">
                    <div className="text-center font-bold pb-1 border-b border-dashed border-stone-400">
                      *** TRANSACTION RECORD (CUSTOMER COPY) ***<br />
                      KADALAI MITTAI ARTISANAL SWEETS<br />
                      KOVILPATTI - TAMIL NADU
                    </div>
                    <div className="flex justify-between pt-1">
                      <span>TID: KM-POS-01</span>
                      <span>BATCH: 004812</span>
                    </div>
                    <div className="flex justify-between">
                      <span>INVOICE: {invoiceNumber}</span>
                      <span>DATE: {new Date().toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CARD: {cardType}</span>
                      <span>PAN: **** 4892</span>
                    </div>
                    <div className="flex justify-between font-bold text-xs py-1 border-y border-dashed border-stone-400">
                      <span>PURCHASE TOTAL:</span>
                      <span>INR {totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-bold">
                      <span>AUTH CODE: {authCode}</span>
                      <span>RRN: {rrnNumber}</span>
                    </div>
                    <div className="text-center text-[9px] text-stone-600 pt-1">
                      STATUS: APPROVED 00 / PIN VERIFIED SUCCESSFUL<br />
                      THANK YOU FOR SHOPPING!
                    </div>
                  </div>

                  {/* Confirmation Status Website Page Trigger */}
                  <button
                    type="button"
                    id="pos-confirm-order-btn"
                    onClick={handleFinishAndConfirmOrder}
                    className="w-full mt-3 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-98 transition-all animate-bounce"
                  >
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>View Confirmation Status on Website →</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosCardSwipeModal;
