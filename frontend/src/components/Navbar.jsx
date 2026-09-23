import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LogOut, Package, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { totalCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-jaggery-100 shadow-sm transition-all duration-300">
      {/* Top Banner Notice */}
      <div className="bg-jaggery-800 text-brand-100 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
        <span>Authentic Kovilpatti Recipe • 100% Natural Organic Jaggery • Free Delivery on Orders Over ₹150!</span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-jaggery-800 flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform duration-300">
            <span className="text-2xl">🥜</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-jaggery-900 leading-none">
              Kadalai <span className="text-brand-600">Mittai</span>
            </span>
            <span className="text-[11px] font-semibold text-jaggery-500 tracking-widest uppercase mt-1">
              Traditional Groundnut Candy
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-semibold transition-colors duration-200 ${
              isActive('/') || isActive('/home')
                ? 'text-brand-700 border-b-2 border-brand-600 pb-1'
                : 'text-jaggery-700 hover:text-brand-700'
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`text-sm font-semibold transition-colors duration-200 ${
              isActive('/products')
                ? 'text-brand-700 border-b-2 border-brand-600 pb-1'
                : 'text-jaggery-700 hover:text-brand-700'
            }`}
          >
            Shop Products
          </Link>
          <Link
            to="/my-orders"
            className={`text-sm font-semibold transition-colors duration-200 ${
              isActive('/my-orders')
                ? 'text-brand-700 border-b-2 border-brand-600 pb-1'
                : 'text-jaggery-700 hover:text-brand-700'
            }`}
          >
            Track Orders
          </Link>
        </div>

        {/* Right Actions: Cart & Profile */}
        <div className="flex items-center gap-4">
          {/* Shopping Cart Button */}
          <Link
            to="/cart"
            id="nav-cart-btn"
            className="relative p-2.5 rounded-full bg-cream-200 text-jaggery-800 hover:bg-brand-100 hover:text-brand-800 transition-all duration-200 shadow-sm flex items-center justify-center group"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-warmOrange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                {totalCount}
              </span>
            )}
          </Link>

          {/* User Profile Menu (Every customer is authenticated) */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              id="user-profile-menu-btn"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-sm font-medium hover:bg-brand-100 transition-all shadow-xs"
            >
              <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline font-bold text-xs">{user?.name ? user.name.split(' ')[0] : 'Customer'}</span>
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-warm border border-jaggery-100 py-2 z-50 animate-scaleUp">
                <div className="px-4 py-2 border-b border-jaggery-100">
                  <p className="text-[10px] uppercase font-bold text-jaggery-400">Signed In Customer</p>
                  <p className="text-sm font-bold text-jaggery-900 truncate">{user?.name}</p>
                  <p className="text-xs text-jaggery-600 truncate">{user?.email}</p>
                  {user?.phone && <p className="text-[11px] font-mono text-jaggery-500">{user.phone}</p>}
                </div>
                <Link
                  to="/my-orders"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-jaggery-700 hover:bg-cream-100 transition-colors"
                >
                  <Package className="w-4 h-4 text-brand-600" />
                  <span>My Orders & Purchases</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-jaggery-800 hover:bg-cream-200"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-jaggery-200 px-6 py-5 space-y-4 shadow-lg animate-fadeIn">
          <div className="pb-3 border-b border-jaggery-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="font-bold text-sm text-jaggery-900">{user?.name}</p>
              <p className="text-xs text-jaggery-500">{user?.email}</p>
            </div>
          </div>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-jaggery-800 py-1"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-jaggery-800 py-1"
          >
            Shop Products
          </Link>
          <Link
            to="/my-orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-jaggery-800 py-1"
          >
            My Orders & Purchases
          </Link>

          <div className="pt-2 border-t border-jaggery-100">
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 py-2 text-xs font-bold text-rose-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
