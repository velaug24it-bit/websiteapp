import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getAdminDashboardApi } from '../../services/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../../components/StatusBadge';

const STATUS_PIE_COLORS = {
  Pending: '#F59E0B',
  Confirmed: '#3B82F6',
  Processing: '#6366F1',
  Packed: '#A855F7',
  Shipped: '#06B6D4',
  'Out for Delivery': '#F97316',
  Delivered: '#10B981',
  Cancelled: '#EF4444',
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getAdminDashboardApi();
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
          Aggregating Sales & Inventory Metrics...
        </p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalProducts: 0,
    activeProducts: 0,
    totalStock: 0,
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  };

  const charts = data?.charts || {
    dailySales: [],
    ordersByStatus: [],
    bestSellers: [],
  };

  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
            Store Performance Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics for Kadalai Mittai operations, stock reserves, and sales revenue.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Products */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Products</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">{stats.totalProducts}</p>
          <span className="text-[11px] text-emerald-400 font-semibold block">
            {stats.activeProducts} active in store
          </span>
        </div>

        {/* Total Stock */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Stock</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">{stats.totalStock}</p>
          <span className="text-[11px] text-slate-400 font-semibold block">Available Units</span>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">{stats.totalOrders}</p>
          <span className="text-[11px] text-slate-400 font-semibold block">All-time count</span>
        </div>

        {/* Total Sales */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sales</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">₹{stats.totalSales}</p>
          <span className="text-[11px] text-emerald-400/90 font-semibold block">Verified Revenue</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Orders</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">{stats.pendingOrders}</p>
          <span className="text-[11px] text-amber-300 font-semibold block">Awaiting Dispatch</span>
        </div>

        {/* Delivered Orders */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivered</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-teal-400 font-mono">{stats.deliveredOrders}</p>
          <span className="text-[11px] text-teal-300 font-semibold block">Fulfilled Safely</span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 7-Day Revenue Trend */}
        <div className="lg:col-span-8 bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Daily Revenue Trend</h2>
              <p className="text-xs text-slate-400">Paid order totals over recent days</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.dailySales}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="_id" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#F1F5F9', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Orders by Status Breakdown */}
        <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-white">Orders by Status</h2>
            <p className="text-xs text-slate-400">Distribution across fulfillment stages</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {charts.ordersByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.ordersByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {charts.ordersByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_PIE_COLORS[entry.status] || '#94A3B8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#F1F5F9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">No orders logged yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Best Sellers and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Best Selling Products */}
        <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-white">Best-Selling Candies</h2>
            <p className="text-xs text-slate-400">Top candies ranked by units sold</p>
          </div>

          <div className="h-60 w-full">
            {charts.bestSellers.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.bestSellers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={10} width={130} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Bar dataKey="totalUnitsSold" fill="#D97706" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 text-center py-20">No sales transactions yet.</p>
            )}
          </div>
        </div>

        {/* Recent Orders Table Preview */}
        <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Recent Orders</h2>
              <p className="text-xs text-slate-400">Latest customer transactions</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-slate-400 py-10 text-center">No orders placed yet.</p>
            ) : (
              recentOrders.map((ord) => (
                <div
                  key={ord._id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-amber-400">{ord.orderId}</span>
                    <p className="text-slate-300 font-semibold">{ord.customer?.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {ord.items?.length} item(s) • ₹{ord.pricing?.totalAmount}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={ord.orderStatus} />
                    <Link
                      to={`/admin/orders/${ord.orderId}`}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
