import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';
import { PwaProvider } from './context/PwaContext';
import InstallPwaModal from './components/InstallPwaModal';

// Customer Layout & Pages
import CustomerLayout from './layouts/CustomerLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Layout & Pages
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductAdd from './pages/admin/AdminProductAdd';
import AdminProductEdit from './pages/admin/AdminProductEdit';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <PwaProvider>
              <InstallPwaModal />
              <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<CustomerLayout />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-success/:orderId" element={<OrderSuccess />} />
                <Route path="my-orders" element={<MyOrders />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

              {/* Admin Login (Standalone) */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<AdminProductAdd />} />
                <Route path="products/edit/:id" element={<AdminProductEdit />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetail />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>

              {/* 404 Catch-All */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4 text-center">
                    <div className="space-y-4 max-w-sm">
                      <div className="text-5xl">🥜</div>
                      <h1 className="font-serif text-3xl font-bold text-jaggery-900">404 - Page Not Found</h1>
                      <p className="text-xs text-jaggery-600">The page you were looking for doesn't exist.</p>
                      <a
                        href="/"
                        className="inline-block px-6 py-2.5 rounded-xl bg-jaggery-800 text-white text-xs font-bold"
                      >
                        Back to Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
            </PwaProvider>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
