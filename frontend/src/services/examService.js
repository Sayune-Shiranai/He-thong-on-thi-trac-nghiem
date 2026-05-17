// src/services/examService.js
// Map toàn bộ API routes từ backend

import api from './api';

// ── Đề thi — /dashboard/exam ──
export const examService = {
  // POST /dashboard/exam — tạo đề thi
  create: (data) => api.post('/dashboard/exam', data),

  // Lấy chi tiết đề + câu hỏi (qua exam_question)
  getById: (id) => api.get(`/dashboard/exam/${id}`),
};

// ── Câu hỏi — /dashboard/question ──
export const questionService = {
  // POST /dashboard/question — tạo câu hỏi thường
  create: (data) => api.post('/dashboard/question', data),

  // POST /dashboard/question/upload — upload ảnh + tạo nhiều câu
  uploadImage: (formData) =>
    api.post('/dashboard/question/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ── Câu hỏi trong đề — /dashboard/exam_question ──
export const examQuestionService = {
  // POST /dashboard/exam_question — thêm câu hỏi vào đề
  add: (data) => api.post('/dashboard/exam_question', data),
};

// ── Môn học — /dashboard/subject ──
export const subjectService = {
  getAll: (params) => api.get('/dashboard/subject', { params }),
  create: (data)   => api.post('/dashboard/subject/create', data),
  update: (id, data) => api.post(`/dashboard/subject/update/${id}`, data),
  delete: (id)     => api.delete(`/dashboard/subject/delete/${id}`),
};

// ── Lớp/Khối — /dashboard/grade ──
export const gradeService = {
  getAll: (params) => api.get('/dashboard/grade', { params }),
  create: (data)   => api.post('/dashboard/grade/create', data),
  update: (id, data) => api.post(`/dashboard/grade/update/${id}`, data),
  delete: (id)     => api.delete(`/dashboard/grade/delete/${id}`),
};

// ── Người dùng — /dashboard/user ──
export const userService = {
  // GET /dashboard/user?page=1&limit=10&keyword=
  getAll: (params) => api.get('/dashboard/user', { params }),
  getById: (id)    => api.get(`/dashboard/user/${id}`),
  update: (id, data) => api.put(`/dashboard/user/update/${id}`, data),
  delete: (id)     => api.delete(`/dashboard/user/delete/${id}`),
  approve: (id)    => api.post(`/dashboard/user/approve/${id}`),
  reject: (id)     => api.post(`/dashboard/user/reject/${id}`),
};
