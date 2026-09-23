import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag, Eye, X, Calendar, Phone, Mail, Award } from 'lucide-react';
import { getAdminCustomersApi, getAdminCustomerDetailApi } from '../../services/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../../components/StatusBadge';
import { TableRowSkeleton } from '../../components/SkeletonLoader';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await getAdminCustomersApi();
        if (res.data.success) {
          setCustomers(res.data.customers);
        }
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleSelectCustomer = async (email) => {
    setModalLoading(true);
    try {
      const res = await getAdminCustomerDetailApi(email);
      if (res.data.success) {
        setSelectedCustomer(res.data.customer);
        setCustomerOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load customer orders:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const filtered = customers.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">Customer Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated order counts, spending totals, and purchase history of all store shoppers.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          Total Shoppers: <span className="text-amber-400 font-mono text-sm">{customers.length}</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, or mobile number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-5">Customer Name</th>
                <th className="py-4 px-5">Email Address</th>
                <th className="py-4 px-5">Phone Number</th>
                <th className="py-4 px-5 text-center">Orders Placed</th>
                <th className="py-4 px-5">Total Spent</th>
                <th className="py-4 px-5">Last Order Date</th>
                <th className="py-4 px-5 text-right">Order History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <TableRowSkeleton cols={7} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => {
                  const lastDate = c.lastOrderDate
                    ? new Date(c.lastOrderDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A';

                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-5 font-bold text-white text-sm">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <span>{c.name}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-300">{c.email}</td>

                      <td className="py-4 px-5 font-mono text-slate-300">{c.phone}</td>

                      <td className="py-4 px-5 text-center font-mono font-bold text-slate-200">
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                          {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
                        </span>
                      </td>

                      <td className="py-4 px-5 font-mono font-black text-amber-400 text-sm">
                        ₹{c.totalSpent}
                      </td>

                      <td className="py-4 px-5 text-slate-400 whitespace-nowrap">{lastDate}</td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleSelectCustomer(c.email)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold inline-flex items-center gap-1.5 transition-colors border border-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View History</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Complete Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-base">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">{selectedCustomer.name}</h3>
                  <p className="text-xs text-slate-400">
                    {selectedCustomer.email} • {selectedCustomer.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-2">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-semibold">Total Orders Placed</span>
                  <p className="text-xl font-black text-white font-mono mt-0.5">
                    {selectedCustomer.totalOrders}
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 block font-semibold">Cumulative Spent</span>
                  <p className="text-xl font-black text-amber-400 font-mono mt-0.5">
                    ₹{selectedCustomer.totalSpent}
                  </p>
                </div>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
                Complete Order History
              </h4>

              <div className="space-y-3">
                {customerOrders.map((ord) => (
                  <div
                    key={ord._id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400">{ord.orderId}</span>
                        <OrderStatusBadge status={ord.orderStatus} />
                        <PaymentStatusBadge status={ord.payment?.paymentStatus} />
                      </div>
                      <span className="font-mono font-bold text-white text-sm">
                        ₹{ord.pricing?.totalAmount}
                      </span>
                    </div>

                    <div className="space-y-0.5 text-slate-400">
                      {ord.items?.map((item, i) => (
                        <p key={i}>
                          • {item.productName} ({item.weight}) × {item.quantity} = ₹{item.subtotal}
                        </p>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                      Shipping to: {ord.shippingAddress?.city}, {ord.shippingAddress?.state} - {ord.shippingAddress?.pincode}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
