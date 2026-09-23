import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2, CreditCard, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createPaymentOrderApi, verifyPaymentApi } from '../services/api';
import RazorpayModal from '../components/RazorpayModal';

const Checkout = () => {
  const { cartItems, subtotal, deliveryCharge, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || 'Raj Kumar',
    email: user?.email || 'customer@gmail.com',
    phone: user?.phone || '9876543210',
    houseNumber: '12/45',
    street: 'Main Road',
    area: 'Gandhipuram',
    city: 'Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641012',
    landmark: 'Opposite Cross Cut Signal',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeRazorpayOrder, setActiveRazorpayOrder] = useState(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaySecurely = async (e, isDemoMode = false) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill in complete customer information.');
      return;
    }
    if (
      !formData.houseNumber.trim() ||
      !formData.street.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      setErrorMessage('Please enter complete delivery address details.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend (calculates amounts from DB prices, verifies stock)
      const payload = {
        isDemo: isDemoMode,
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
        })),
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          houseNumber: formData.houseNumber,
          street: formData.street,
          area: formData.area,
          city: formData.city,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
        },
      };

      const res = await createPaymentOrderApi(payload);

      if (!res.data.success) {
        setErrorMessage(res.data.message || 'Unable to initialize order.');
        setLoading(false);
        return;
      }

      const orderData = res.data;
      setActiveRazorpayOrder(orderData);

      // If user selected Live Payment and Razorpay SDK is available:
      if (!isDemoMode && window.Razorpay && orderData.isLive) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'Kadalai Mittai Artisanal Store',
          description: 'Payment for Groundnut Candy Order',
          order_id: orderData.razorpayOrderId,
          handler: async function (response) {
            await handlePaymentVerification({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#4A2A17',
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (errResp) {
          setErrorMessage(`Payment failed: ${errResp.error.description}`);
          setLoading(false);
        });
        rzp.open();
        setLoading(false);
      } else {
        // Open demo payment simulator modal
        setIsSimulatorOpen(true);
        setLoading(false);
      }
    } catch (err) {
      console.error('Payment order creation failed:', err);
      setErrorMessage(
        err.response?.data?.message || 'Payment initiation failed. Please check stock or details.'
      );
      setLoading(false);
    }
  };

  const handlePaymentVerification = async (paymentDetails) => {
    setLoading(true);
    try {
      const verifyPayload = {
        razorpayOrderId: paymentDetails.razorpay_order_id,
        razorpayPaymentId: paymentDetails.razorpay_payment_id,
        razorpaySignature: paymentDetails.razorpay_signature,
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
        })),
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          houseNumber: formData.houseNumber,
          street: formData.street,
          area: formData.area,
          city: formData.city,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
        },
      };

      const verifyRes = await verifyPaymentApi(verifyPayload);

      if (verifyRes.data.success) {
        clearCart();
        setIsSimulatorOpen(false);
        navigate(`/order-success/${verifyRes.data.order.orderId}`, {
          state: { order: verifyRes.data.order },
        });
      } else {
        setErrorMessage(verifyRes.data.message || 'Payment signature verification failed.');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setErrorMessage(
        err.response?.data?.message || 'Payment verification failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <Link to="/cart" className="p-2 rounded-xl bg-cream-200 text-jaggery-800 hover:bg-cream-300">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-jaggery-900">Secure Checkout</h1>
          <p className="text-xs text-jaggery-600">Enter delivery address and complete payment via Razorpay.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePaySecurely} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Left Columns: Form Fields */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Customer Information Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-soft border border-jaggery-100 space-y-4 sm:space-y-5">
            <h2 className="font-serif text-base sm:text-lg font-bold text-jaggery-900 pb-3 border-b border-jaggery-100 flex items-center gap-2">
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center text-xs font-bold">1</span>
              Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-jaggery-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  id="checkout-name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Raj Kumar"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-jaggery-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  name="phone"
                  id="checkout-phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-jaggery-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  id="checkout-email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="customer@gmail.com"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-jaggery-100 space-y-5">
            <h2 className="font-serif text-lg font-bold text-jaggery-900 pb-3 border-b border-jaggery-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center text-xs font-bold">2</span>
              Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-jaggery-700 mb-1">House / Door Number *</label>
                <input
                  type="text"
                  name="houseNumber"
                  id="checkout-house"
                  required
                  value={formData.houseNumber}
                  onChange={handleChange}
                  placeholder="e.g. 12/45, Flat 3B"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-jaggery-700 mb-1">Street *</label>
                <input
                  type="text"
                  name="street"
                  id="checkout-street"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="e.g. Main Road, Cross Cut"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-jaggery-700 mb-1">Area / Locality *</label>
                <input
                  type="text"
                  name="area"
                  id="checkout-area"
                  required
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. Gandhipuram"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-jaggery-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  id="checkout-city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Coimbatore"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-jaggery-700 mb-1">District *</label>
                <input
                  type="text"
                  name="district"
                  id="checkout-district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="e.g. Coimbatore"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-jaggery-700 mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  id="checkout-state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Tamil Nadu"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-jaggery-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  id="checkout-pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="641012"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-jaggery-700 mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  id="checkout-landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="Opposite Cross Cut Signal"
                  className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-jaggery-200 text-sm font-medium text-jaggery-900 focus:outline-hidden focus:border-brand-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Pay */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-soft border border-jaggery-100 sticky top-28 space-y-6">
            <h2 className="font-serif text-lg font-bold text-jaggery-900 pb-3 border-b border-jaggery-100">
              Order Summary
            </h2>

            {/* Items list preview */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex items-center justify-between text-xs">
                  <div className="flex-1 pr-2">
                    <p className="font-bold text-jaggery-900 line-clamp-1">{item.name}</p>
                    <p className="text-jaggery-500 font-mono">
                      ₹{item.price} × {item.quantity} ({item.weight})
                    </p>
                  </div>
                  <span className="font-bold text-jaggery-900 font-mono">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-3 border-t border-jaggery-100 text-xs text-jaggery-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-jaggery-900 font-mono">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-jaggery-900 font-mono">
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="pt-2 border-t border-jaggery-100 flex justify-between items-baseline text-sm">
                <span className="font-bold text-jaggery-900">Total Amount</span>
                <span className="text-2xl font-black text-brand-700 font-mono">₹{grandTotal}</span>
              </div>
            </div>

            {/* Payment Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* 1. Real Live Razorpay Gateway Button */}
              <button
                type="button"
                id="pay-live-razorpay-btn"
                disabled={loading}
                onClick={(e) => handlePaySecurely(e, false)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-jaggery-800 hover:from-emerald-800 hover:to-jaggery-900 text-white font-bold text-sm shadow-warm transition-all duration-300 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay with Razorpay (Live Gateway ₹{grandTotal})</span>
                  </>
                )}
              </button>

              {/* 2. Instant Demo Sandbox Test Payment Button */}
              <button
                type="button"
                id="pay-demo-simulator-btn"
                disabled={loading}
                onClick={(e) => handlePaySecurely(e, true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-jaggery-900 border border-brand-300 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-warmOrange" />
                <span>⚡ Demo Test Pay (Instant Sandbox Test - ₹{grandTotal})</span>
              </button>

              <div className="text-center space-y-1 pt-1">
                <p className="text-[11px] text-jaggery-600 flex items-center justify-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Live Razorpay 256-Bit SSL Encrypted
                </p>
                <p className="text-[10px] text-jaggery-400">
                  Choose Live Gateway to pay real funds, or Demo Test Pay for instant sandbox testing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Razorpay Test Simulation Modal */}
      <RazorpayModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        orderData={activeRazorpayOrder}
        onSuccess={handlePaymentVerification}
        onFailure={(msg) => {
          setIsSimulatorOpen(false);
          setErrorMessage(msg);
        }}
      />
    </div>
  );
};

export default Checkout;
