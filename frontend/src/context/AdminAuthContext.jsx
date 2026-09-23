import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLoginApi, getAdminProfileApi, updateAdminProfileApi } from '../services/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('kadalai_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('kadalai_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (adminToken) {
        try {
          const res = await getAdminProfileApi();
          if (res.data.success) {
            setAdmin(res.data.admin);
            localStorage.setItem('kadalai_admin_user', JSON.stringify(res.data.admin));
          }
        } catch (err) {
          console.error('Admin session invalid or expired:', err);
          adminLogout();
        }
      }
      setLoading(false);
    };
    fetchAdminProfile();
  }, [adminToken]);

  const login = async (email, password) => {
    const res = await adminLoginApi({ email, password });
    if (res.data.success) {
      setAdminToken(res.data.token);
      setAdmin(res.data.admin);
      localStorage.setItem('kadalai_admin_token', res.data.token);
      localStorage.setItem('kadalai_admin_user', JSON.stringify(res.data.admin));
    }
    return res.data;
  };

  const updateProfile = async (data) => {
    const res = await updateAdminProfileApi(data);
    if (res.data.success) {
      setAdmin(res.data.admin);
      localStorage.setItem('kadalai_admin_user', JSON.stringify(res.data.admin));
    }
    return res.data;
  };

  const adminLogout = () => {
    setAdminToken(null);
    setAdmin(null);
    localStorage.removeItem('kadalai_admin_token');
    localStorage.removeItem('kadalai_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        adminToken,
        isAdminAuthenticated: !!adminToken,
        loading,
        login,
        logout: adminLogout,
        updateProfile,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
