// src/services/api.js
// Axios instance kết nối với backend Node.js/Express (port 3000)
// Backend dùng httpOnly cookie để lưu accessToken + refreshToken

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // BẮT BUỘC: gửi cookie httpOnly cùng mỗi request
});

// Response interceptor: xử lý lỗi 401 (hết token)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Xóa user khỏi localStorage và về trang login
      localStorage.removeItem('examflow_user');
      window.location.href = '/login';
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Có lỗi xảy ra!';
    return Promise.reject(new Error(message));
  }
);

export default api;
