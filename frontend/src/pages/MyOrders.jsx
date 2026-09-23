import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Calendar, ChevronRight, Eye, X, Clock, CheckCircle2, Truck, MapPin } from 'lucide-react';
import { getMyOrdersApi, getOrderByIdApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/StatusBadge';

const MyOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lookupEmail, setLookupEmail] = useState(user?.email || 'customer@gmail.com');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchOrders = async (emailToFetch) => {
    setLoading(true);
    try {
      const params = {};
      if (emailToFetch) params.email = emailToFetch.trim();

      const res = await getMyOrdersApi(params);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(user?.email || 'customer@gmail.com');
  }, [user]);

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    if (lookupEmail.trim()) {
      fetchOrders(lookupEmail);
    }
  };

  const handleViewDetails = async (orderId) => {
    setModalLoading(true);
    try {
      const res = await getOrderByIdApi(orderId);
      if (res.data.success) {
        setSelectedOrder(res.data.order);
      }
    } catch (err) {
      console.error('Failed to get order details:', err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-jaggery-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-jaggery-900">Track & View Orders</h1>
          <p className="text-xs text-jaggery-600 mt-1">
            Real-time status updates for all your handcrafted Groundnut Candy shipments.
          </p>
        </div>

        {/* Quick lookup box */}
        <form onSubmit={handleLookupSubmit} className="flex items-center gap-2">
          <input
            type="email"
            placeholder="Search by email..."
            value={lookupEmail}
            onChange={(e) => setLookupEmail(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-jaggery-200 text-xs text-jaggery-900 focus:outline-hidden focus:border-brand-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-jaggery-800 text-white text-xs font-bold hover:bg-jaggery-900 transition-colors shrink-0"
          >
            Find Orders
          </button>
        </form>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-jaggery-600 font-medium">Fetching orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-jaggery-100 max-w-md mx-auto space-y-4">
          <div className="text-4xl">📦</div>
          <h3 className="font-serif text-xl font-bold text-jaggery-900">No Orders Found</h3>
          <p className="text-xs text-jaggery-600">
            No order history found for <span className="font-bold">{lookupEmail}</span>. Try searching another email or start shopping!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-jaggery-800 text-white text-xs font-bold hover:bg-jaggery-900 transition-all"
          >
            Shop Kadalai Mittai Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-jaggery-100 hover:shadow-warm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left: Info & items */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-jaggery-900 bg-cream-200 px-3 py-1 rounded-full">
                      {order.orderId}
                    </span>
                    <span className="text-xs text-jaggery-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {formattedDate}
                    </span>
                    <OrderStatusBadge status={order.orderStatus} />
                    <PaymentStatusBadge status={order.payment?.paymentStatus} />
                  </div>

                  {/* Products summary */}
                  <div className="space-y-1">
                    {order.items?.map((item, idx) => (
                      <p key={idx} className="text-xs text-jaggery-700">
                        <strong className="text-jaggery-900">{item.productName}</strong> ({item.weight}) × {item.quantity}
                      </p>
                    ))}
                  </div>

                  <p className="text-xs text-jaggery-500">
                    Deliver to: <span className="text-jaggery-800 font-medium">{order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
                  </p>
                </div>

                {/* Right: Total & View Details Button */}
                <div className="flex items-center justify-between md:flex-col md:items-end w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-jaggery-100">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-jaggery-500 block">Total Amount</span>
                    <span className="font-mono text-xl font-black text-brand-700">
                      ₹{order.pricing?.totalAmount}
                    </span>
                  </div>

                  <button
                    onClick={() => handleViewDetails(order.orderId)}
                    className="px-5 py-2.5 rounded-xl bg-cream-200 hover:bg-brand-100 text-jaggery-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Complete Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-jaggery-100 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-jaggery-900 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs text-brand-400 font-mono">ORDER #{selectedOrder.orderId}</span>
                <h3 className="font-serif text-xl font-bold">Complete Order Summary</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-jaggery-800">
              {/* Status Header */}
              <div className="flex items-center justify-between bg-cream-100 p-4 rounded-2xl">
                <div>
                  <span className="text-jaggery-500 font-medium">Order Status</span>
                  <div className="mt-1">
                    <OrderStatusBadge status={selectedOrder.orderStatus} />
                  </div>
                </div>
                <div>
                  <span className="text-jaggery-500 font-medium">Payment Status</span>
                  <div className="mt-1">
                    <PaymentStatusBadge status={selectedOrder.payment?.paymentStatus} />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-jaggery-500 font-medium">Total Paid</span>
                  <p className="text-lg font-black text-brand-700 font-mono">₹{selectedOrder.pricing?.totalAmount}</p>
                </div>
              </div>

              {/* Customer and Delivery Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-cream-50 p-4 rounded-2xl border border-jaggery-100 space-y-1">
                  <p className="font-bold uppercase tracking-wider text-jaggery-500 text-[10px]">Customer</p>
                  <p className="font-bold text-sm text-jaggery-900">{selectedOrder.customer?.name}</p>
                  <p>{selectedOrder.customer?.email}</p>
                  <p className="font-mono">{selectedOrder.customer?.phone}</p>
                </div>

                <div className="bg-cream-50 p-4 rounded-2xl border border-jaggery-100 space-y-1">
                  <p className="font-bold uppercase tracking-wider text-jaggery-500 text-[10px]">Shipping Address</p>
                  <p className="font-medium text-jaggery-900">
                    {selectedOrder.shippingAddress?.houseNumber}, {selectedOrder.shippingAddress?.street}
                  </p>
                  <p>{selectedOrder.shippingAddress?.area}, {selectedOrder.shippingAddress?.city}</p>
                  <p>{selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</p>
                  {selectedOrder.shippingAddress?.landmark && (
                    <p className="text-jaggery-500">Landmark: {selectedOrder.shippingAddress?.landmark}</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="font-bold uppercase tracking-wider text-jaggery-500 text-[10px] mb-2">Ordered Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-jaggery-100">
                      <div>
                        <p className="font-bold text-jaggery-900">{item.productName}</p>
                        <p className="text-jaggery-500 font-mono">Weight: {item.weight} • Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold font-mono text-sm">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details info */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] font-mono text-gray-600 space-y-1">
                <p>Razorpay Order ID: {selectedOrder.payment?.razorpayOrderId || 'N/A'}</p>
                <p>Razorpay Payment ID: {selectedOrder.payment?.razorpayPaymentId || 'N/A'}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-cream-100 border-t border-jaggery-100 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 rounded-xl bg-jaggery-800 text-white font-bold text-xs hover:bg-jaggery-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
