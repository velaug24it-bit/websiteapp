import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter, Calendar, RefreshCw, X } from 'lucide-react';
import { getAdminOrdersApi } from '../../services/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../../components/StatusBadge';
import { TableRowSkeleton } from '../../components/SkeletonLoader';
import { ORDER_STATUSES } from '../../utils/constants';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [orderStatus, setOrderStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (paymentStatus !== 'all') params.paymentStatus = paymentStatus;
      if (orderStatus !== 'all') params.orderStatus = orderStatus;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await getAdminOrdersApi(params);
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
    const delay = setTimeout(() => {
      fetchOrders();
    }, 250);
    return () => clearTimeout(delay);
  }, [search, paymentStatus, orderStatus, startDate, endDate]);

  const handleResetFilters = () => {
    setSearch('');
    setPaymentStatus('all');
    setOrderStatus('all');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">Order Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track, filter, and update customer shipments and Razorpay transaction states.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="admin-orders-search"
            placeholder="Search by Order ID (GNC-...), customer name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs">
          {/* Order Status */}
          <div>
            <label className="block text-slate-400 font-bold mb-1">Order Status:</label>
            <select
              value={orderStatus}
              id="admin-order-status-filter"
              onChange={(e) => setOrderStatus(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-hidden focus:border-amber-500"
            >
              <option value="all">All Order Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-slate-400 font-bold mb-1">Payment Status:</label>
            <select
              value={paymentStatus}
              id="admin-payment-status-filter"
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-hidden focus:border-amber-500"
            >
              <option value="all">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-slate-400 font-bold mb-1">From Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-slate-400 font-bold mb-1">To Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>

        {/* Clear Filters button */}
        {(search || paymentStatus !== 'all' || orderStatus !== 'all' || startDate || endDate) && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-5">Order ID</th>
                <th className="py-4 px-5">Customer</th>
                <th className="py-4 px-5">Phone</th>
                <th className="py-4 px-5">Products Summary</th>
                <th className="py-4 px-5">Amount</th>
                <th className="py-4 px-5">Payment</th>
                <th className="py-4 px-5">Order Status</th>
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <TableRowSkeleton cols={9} />
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No orders found matching current criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const dateStr = new Date(ord.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={ord._id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Order ID */}
                      <td className="py-4 px-5 font-mono font-bold text-amber-400">
                        {ord.orderId}
                      </td>

                      {/* Customer Name */}
                      <td className="py-4 px-5">
                        <p className="font-bold text-white text-sm">{ord.customer?.name}</p>
                        <p className="text-[11px] text-slate-400">{ord.customer?.email}</p>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-5 font-mono text-slate-300">{ord.customer?.phone}</td>

                      {/* Products */}
                      <td className="py-4 px-5 max-w-xs">
                        <div className="space-y-0.5">
                          {ord.items?.map((item, idx) => (
                            <p key={idx} className="truncate text-slate-300">
                              {item.productName} ({item.weight}) × <strong>{item.quantity}</strong>
                            </p>
                          ))}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-5 font-mono font-black text-amber-400 text-sm">
                        ₹{ord.pricing?.totalAmount}
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-5">
                        <PaymentStatusBadge status={ord.payment?.paymentStatus} />
                      </td>

                      {/* Order Status */}
                      <td className="py-4 px-5">
                        <OrderStatusBadge status={ord.orderStatus} />
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 text-slate-400 text-[11px] whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <Link
                          to={`/admin/orders/${ord.orderId}`}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold inline-flex items-center gap-1.5 transition-colors border border-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Order</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
