// src/context/AuthContext.jsx
// Backend dùng httpOnly cookie → không lưu token vào localStorage
// Chỉ lưu thông tin user (không nhạy cảm) để hiển thị UI

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Khôi phục user từ localStorage khi F5 trang
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('examflow_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Lưu user vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem('examflow_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('examflow_user');
    }
  }, [user]);

  // Đăng nhập — POST /login
  // Backend trả về: { message, user: { id, username, email, role_id, role_name }, accessToken }
  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const data = await authService.login(username, password);
      const userData = {
        id:        data.user.id,
        name:      data.user.username,
        email:     data.user.email,
        role_id:   data.user.role_id,
        role_name: data.user.role_name,
        // role_id: 1 = Admin, 2 = Teacher, 3 = Student
      };
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  }, []);

  // Đăng ký — POST /register
  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  // Đăng xuất — POST /logout (xóa cookie phía server)
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch { /* bỏ qua lỗi */ }
    setUser(null);
  }, []);

  // role_name === 'Admin' hoặc role_id === 1 → là admin
  const isAdmin = user?.role_name === 'Admin' || user?.role_id === 1;
  const isTeacher = user?.role_name === 'Teacher' || user?.role_id === 2;

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, isAdmin, isTeacher
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng trong AuthProvider');
  return ctx;
};
