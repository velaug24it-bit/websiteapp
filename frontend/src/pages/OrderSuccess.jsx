import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Truck, ArrowRight, ShoppingBag, Calendar, MapPin, User, Hash } from 'lucide-react';
import { getOrderByIdApi } from '../services/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/StatusBadge';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    // Confetti celebration animation!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D97706', '#B45309', '#EA580C', '#4A2A17', '#10B981'],
    });

    // If order was not passed via router state, fetch from backend API
    if (!order) {
      const fetchOrder = async () => {
        try {
          const res = await getOrderByIdApi(orderId);
          if (res.data.success) {
            setOrder(res.data.order);
          }
        } catch (err) {
          console.error('Failed to load order:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-jaggery-600 font-medium">Loading your order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-4xl">📦</div>
        <h2 className="font-serif text-2xl font-bold text-jaggery-900">Order Not Found</h2>
        <p className="text-xs text-jaggery-600">We could not retrieve order #{orderId}.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-jaggery-800 text-white text-xs font-bold"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const expectedDate = order.expectedDelivery
    ? new Date(order.expectedDelivery).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Within 3-4 Business Days';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fadeIn">
      {/* Celebration Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-800 text-white rounded-3xl p-8 sm:p-10 shadow-warm text-center space-y-3 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl mx-auto shadow-inner">
          🎉
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-emerald-100 text-sm max-w-lg mx-auto font-medium">
          Thank you for choosing Kadalai Mittai! Your artisanal groundnut candy batch is being freshly packed at our Kovilpatti workshop.
        </p>

        {/* Quick Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
          <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5" /> Order ID: <span className="font-mono">{order.orderId}</span>
          </span>
          <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Expected Delivery: {expectedDate}
          </span>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-jaggery-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-jaggery-100">
          <div>
            <span className="text-xs text-jaggery-500 font-medium">Payment Status</span>
            <div className="mt-1">
              <PaymentStatusBadge status={order.payment?.paymentStatus || 'Paid'} />
            </div>
          </div>
          <div>
            <span className="text-xs text-jaggery-500 font-medium">Order Status</span>
            <div className="mt-1">
              <OrderStatusBadge status={order.orderStatus || 'Confirmed'} />
            </div>
          </div>
          <div className="sm:text-right">
            <span className="text-xs text-jaggery-500 font-medium">Grand Total</span>
            <p className="text-xl font-black text-jaggery-900 font-mono">
              ₹{order.pricing?.totalAmount}
            </p>
          </div>
        </div>

        {/* Customer & Shipping Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cream-50 p-5 rounded-2xl border border-jaggery-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-jaggery-500 mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-600" /> Customer Information
            </h3>
            <p className="text-sm font-bold text-jaggery-900">{order.customer?.name}</p>
            <p className="text-xs text-jaggery-600">{order.customer?.email}</p>
            <p className="text-xs text-jaggery-600 font-mono mt-0.5">{order.customer?.phone}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-jaggery-500 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600" /> Delivery Address
            </h3>
            <p className="text-xs text-jaggery-800 leading-relaxed font-medium">
              {order.shippingAddress?.houseNumber}, {order.shippingAddress?.street},<br />
              {order.shippingAddress?.area}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode},<br />
              {order.shippingAddress?.state}
              {order.shippingAddress?.landmark && ` (Landmark: ${order.shippingAddress?.landmark})`}
            </p>
          </div>
        </div>

        {/* Ordered Items List */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-jaggery-500 mb-3 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-brand-600" /> Ordered Items ({order.items?.length})
          </h3>

          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-cream-50/60 border border-jaggery-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-12 rounded-xl object-cover border border-jaggery-100"
                    />
                  )}
                  <div>
                    <p className="font-bold text-jaggery-900 text-sm">{item.productName}</p>
                    <p className="text-jaggery-500 font-mono">
                      Weight: {item.weight} • Qty: <strong>{item.quantity}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono text-xs text-jaggery-500">₹{item.price} each</p>
                  <p className="font-mono text-sm font-bold text-jaggery-900">₹{item.subtotal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing calculations */}
        <div className="pt-4 border-t border-jaggery-100 text-xs text-jaggery-600 space-y-1.5 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-bold text-jaggery-900 font-mono">₹{order.pricing?.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge:</span>
            <span className="font-bold text-jaggery-900 font-mono">
              {order.pricing?.deliveryCharge === 0 ? 'FREE' : `₹${order.pricing?.deliveryCharge}`}
            </span>
          </div>
          <div className="pt-2 border-t border-jaggery-100 flex justify-between text-sm">
            <span className="font-bold text-jaggery-900">Grand Total:</span>
            <span className="font-black text-brand-700 font-mono">₹{order.pricing?.totalAmount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-jaggery-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/my-orders"
            id="order-success-view-orders-btn"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-jaggery-800 hover:bg-jaggery-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Package className="w-4 h-4" />
            <span>View My Orders</span>
          </Link>

          <Link
            to="/products"
            id="order-success-continue-shopping-btn"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cream-200 hover:bg-brand-100 text-jaggery-900 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
