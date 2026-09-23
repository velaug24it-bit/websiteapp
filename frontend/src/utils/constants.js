const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
export const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

export const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export const ORDER_STATUS_COLORS = {
  Pending: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
  Confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  Processing: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
  Packed: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  Shipped: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
  'Out for Delivery': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  Delivered: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  Cancelled: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
};

export const PAYMENT_STATUS_COLORS = {
  Paid: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  Pending: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
  Failed: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' },
  Refunded: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
};
