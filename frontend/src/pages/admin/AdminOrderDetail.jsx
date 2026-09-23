import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  MapPin,
  Package,
  CreditCard,
  Save,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Hash,
} from 'lucide-react';
import { getAdminOrderByIdApi, updateAdminOrderStatusApi } from '../../services/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../../components/StatusBadge';
import { ORDER_STATUSES } from '../../utils/constants';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await getAdminOrderByIdApi(id);
      if (res.data.success) {
        setOrder(res.data.order);
        setSelectedStatus(res.data.order.orderStatus);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError('Failed to fetch order information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    setNotice(null);
    try {
      const res = await updateAdminOrderStatusApi(order.orderId, selectedStatus);
      if (res.data.success) {
        setOrder(res.data.order);
        setNotice({
          type: 'success',
          msg: `Order status successfully changed to "${selectedStatus}". Stock updated if cancelled.`,
        });
      } else {
        setNotice({ type: 'error', msg: res.data.message || 'Status update failed.' });
      }
    } catch (err) {
      setNotice({ type: 'error', msg: err.response?.data?.message || 'Status update failed.' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading order records...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-white">Order Record Not Found</h2>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Order #{order.orderId}
              </h1>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Placed on {orderDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <PaymentStatusBadge status={order.payment?.paymentStatus} />
          <span className="text-xl font-black font-mono text-amber-400">
            ₹{order.pricing?.totalAmount}
          </span>
        </div>
      </div>

      {notice && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn ${
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

      {/* Order Status Updater Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3">
          Update Order Status
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <select
            value={selectedStatus}
            id="admin-status-dropdown"
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-64 py-3 px-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-hidden focus:border-amber-500"
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            onClick={handleStatusUpdate}
            disabled={updating || selectedStatus === order.orderStatus}
            id="admin-update-status-btn"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-40"
          >
            <Save className="w-4 h-4" />
            <span>{updating ? 'Updating Status...' : 'Update Order Status'}</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          Note: Transitioning to <strong>Cancelled</strong> automatically restores inventory stock in MongoDB.
        </p>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <User className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif text-base font-bold text-white">Customer Details</h2>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Customer Name</span>
              <p className="font-bold text-white text-sm">{order.customer?.name}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mobile Phone</span>
              <p className="font-mono text-slate-200">{order.customer?.phone}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Email Address</span>
              <p className="text-slate-200">{order.customer?.email}</p>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <MapPin className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif text-base font-bold text-white">Delivery Address</h2>
          </div>

          <div className="space-y-1.5 text-xs text-slate-200 leading-relaxed font-medium">
            <p className="font-bold text-white">
              Door No: {order.shippingAddress?.houseNumber}, {order.shippingAddress?.street}
            </p>
            <p>Area: {order.shippingAddress?.area}</p>
            <p>City: {order.shippingAddress?.city}, District: {order.shippingAddress?.district}</p>
            <p>State: {order.shippingAddress?.state} - Pincode: {order.shippingAddress?.pincode}</p>
            {order.shippingAddress?.landmark && (
              <p className="text-slate-400">Landmark: {order.shippingAddress?.landmark}</p>
            )}
          </div>
        </div>
      </div>

      {/* Ordered Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-400" />
          <h2 className="font-serif text-base font-bold text-white">
            Ordered Products ({order.items?.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Weight</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Quantity</th>
                <th className="py-3 px-6 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {order.items?.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-4 px-6 font-bold text-white">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                        />
                      )}
                      <span>{item.productName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-300">{item.weight}</td>
                  <td className="py-4 px-6 font-mono text-slate-300">₹{item.price}</td>
                  <td className="py-4 px-6 font-mono font-bold text-amber-400">{item.quantity}</td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-white">
                    ₹{item.subtotal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Breakdown */}
        <div className="p-6 bg-slate-950/60 border-t border-slate-800 flex flex-col items-end space-y-2 text-xs">
          <div className="w-64 flex justify-between text-slate-400">
            <span>Subtotal:</span>
            <span className="font-mono font-bold text-white">₹{order.pricing?.subtotal}</span>
          </div>
          <div className="w-64 flex justify-between text-slate-400">
            <span>Delivery Charge:</span>
            <span className="font-mono font-bold text-white">
              {order.pricing?.deliveryCharge === 0 ? 'FREE' : `₹${order.pricing?.deliveryCharge}`}
            </span>
          </div>
          <div className="w-64 pt-2 border-t border-slate-800 flex justify-between text-sm">
            <span className="font-bold text-white">Grand Total:</span>
            <span className="font-mono font-black text-amber-400">₹{order.pricing?.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Payment Details Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <CreditCard className="w-4 h-4 text-amber-400" />
          <h2 className="font-serif text-base font-bold text-white">Payment & Gateway Details</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Payment Status</span>
            <div className="mt-1">
              <PaymentStatusBadge status={order.payment?.paymentStatus} />
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Razorpay Order ID</span>
            <p className="text-slate-200 mt-1 truncate">{order.payment?.razorpayOrderId || 'N/A'}</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Razorpay Payment ID</span>
            <p className="text-slate-200 mt-1 truncate">{order.payment?.razorpayPaymentId || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
