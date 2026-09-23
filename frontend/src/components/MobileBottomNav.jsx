import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Sparkles, ShoppingBag, Package, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav = () => {
  const { totalCount } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  // Don't display on admin routes or auth screen
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      label: 'Home',
      to: '/',
      icon: Home,
      id: 'mobile-nav-home',
    },
    {
      label: 'Candies',
      to: '/products',
      icon: Sparkles,
      id: 'mobile-nav-products',
    },
    {
      label: 'Cart',
      to: '/cart',
      icon: ShoppingBag,
      badge: totalCount,
      id: 'mobile-nav-cart',
    },
    {
      label: 'My Orders',
      to: '/my-orders',
      icon: Package,
      id: 'mobile-nav-orders',
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-jaggery-100 shadow-[0_-4px_20px_rgba(38,17,8,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 4px)' }}
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.to === '/'
              ? location.pathname === '/' || location.pathname === '/home'
              : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              id={item.id}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-brand-700 font-bold'
                  : 'text-jaggery-500 hover:text-jaggery-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'scale-100'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-warmOrange text-white text-[10px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-brand-600"></span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
