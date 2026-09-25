import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach appropriate JWT Bearer token
api.interceptors.request.use((config) => {
  // If request URL starts with /admin, use admin token
  if (config.url && config.url.startsWith('/admin')) {
    const adminToken = localStorage.getItem('kadalai_admin_token');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    // Customer token
    const customerToken = localStorage.getItem('kadalai_customer_token');
    if (customerToken) {
      config.headers.Authorization = `Bearer ${customerToken}`;
    }
  }
  return config;
});

// Customer Auth APIs
export const registerApi = (data) => api.post('/auth/register', data);
export const loginApi = (data) => api.post('/auth/login', data);
export const getProfileApi = () => api.get('/auth/profile');

// Product APIs
export const getProductsApi = (params) => api.get('/products', { params });
export const getProductByIdApi = (id) => api.get(`/products/${id}`);

// Payment & Checkout APIs
export const createPaymentOrderApi = (data) => api.post('/payment/create-order', data);
export const verifyPaymentApi = (data) => api.post('/payment/verify', data);
export const pushPosOrderApi = (data) => api.post('/payment/pos/push', data);
export const getPosOrderStatusApi = (orderId) => api.get(`/payment/pos/status/${orderId}`);

// Orders APIs
export const getMyOrdersApi = (params) => api.get('/orders/my-orders', { params });
export const getOrderByIdApi = (id) => api.get(`/orders/${id}`);

// Admin Auth & Profile APIs
export const adminLoginApi = (data) => api.post('/admin/login', data);
export const getAdminProfileApi = () => api.get('/admin/profile');
export const updateAdminProfileApi = (data) => api.put('/admin/profile', data);

// Admin Dashboard & Analytics APIs
export const getAdminDashboardApi = () => api.get('/admin/dashboard');

// Admin Product Management APIs
export const getAdminProductsApi = (params) => api.get('/admin/products', { params });
export const createAdminProductApi = (data) => api.post('/admin/products', data);
export const updateAdminProductApi = (id, data) => api.put(`/admin/products/${id}`, data);
export const deleteAdminProductApi = (id) => api.delete(`/admin/products/${id}`);

// Admin Order Management APIs
export const getAdminOrdersApi = (params) => api.get('/admin/orders', { params });
export const getAdminOrderByIdApi = (id) => api.get(`/admin/orders/${id}`);
export const updateAdminOrderStatusApi = (id, orderStatus) =>
  api.put(`/admin/orders/${id}/status`, { orderStatus });

// Admin Customer Directory APIs
export const getAdminCustomersApi = () => api.get('/admin/customers');
export const getAdminCustomerDetailApi = (email) => api.get(`/admin/customers/${encodeURIComponent(email)}`);

export default api;
