import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomerAuth from '../pages/CustomerAuth';
import { useAuth } from '../context/AuthContext';

const CustomerLayout = () => {
  const { pathname } = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-jaggery-800 tracking-wider uppercase">
            Loading Kadalai Mittai Store...
          </p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show Login & Sign Up page first!
  if (!isAuthenticated) {
    return <CustomerAuth />;
  }

  // Once authenticated, allow access to the main store dashboard and pages
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-jaggery-900 selection:bg-brand-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
