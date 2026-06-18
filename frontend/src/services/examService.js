import api from './api';

// ── Đề thi ──
export const examService = {
  create:  (data)   => api.post('/dashboard/exam', data),
  getAll:  (params) => api.get('/exam', { params }),        // public endpoint
  getById: (id)     => api.get(`/dashboard/exam/${id}`),
};

// ── Câu hỏi ──
export const questionService = {
  create:      (data)       => api.post('/dashboard/question', data),
  uploadImage: (formData)   => api.post('/dashboard/question/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ── Câu hỏi trong đề ──
export const examQuestionService = {
  add: (data) => api.post('/dashboard/exam_question', data),
};

// ── Môn học ──
export const subjectService = {
  GetPagedSubjects: (params)     => api.get('/dashboard/subject', { params }),
  GetAllSubjects: () => api.get('/dashboard/subject/all'),
  CreateSubject: (data)       => api.post('/dashboard/subject/create', data),
  UpdateSubject: (id, data)   => api.post(`/dashboard/subject/update/${id}`, data),
  DeleteSubject: (id)         => api.delete(`/dashboard/subject/delete/${id}`),
};

// ── Khối lớp ──
export const gradeService = {
  GetPagedGrades: (params)     => api.get('/dashboard/grade', { params }),
  GetAllGrades: () => api.get('/dashboard/grade/all'),
  CreateGrade: (data)       => api.post('/dashboard/grade/create', data),
  UpdateGrade: (id, data)   => api.post(`/dashboard/grade/update/${id}`, data),
  DeleteGrade: (id)         => api.delete(`/dashboard/grade/delete/${id}`),
};

// ── Người dùng (admin) ──
export const userService = {
  getPagedUsers:  (params)   => api.get('/dashboard/user', { params }),
  getUserById: (id)       => api.get(`/dashboard/user/${id}`),
  updateUser:  (id, data) => api.put(`/dashboard/user/update/${id}`, data),
  deleteUser:  (id)       => api.delete(`/dashboard/user/delete/${id}`),
  approveUser: (id)       => api.post(`/dashboard/user/approve/${id}`, {},),
  rejectUser:  (id)       => api.post(`/dashboard/user/reject/${id}`, {},),
  GetAllUserRoleTeacher: () => api.get('/dashboard/user/teacher'),
};

export const roleService = {
  GetPagedRoles: (params) => api.get('/dashboard/role', { params }),
  CreateRole: (data) => api.post('/dashboard/role/create', data),
  DeleteRole: (id) => api.delete(`/dashboard/role/delete/${id}`),
  GetAllRoles: (params) => api.get('/dashboard/role/all', { params }),
};

export const teacherService = {
  GetPagedTeachers: (params) => api.get('/dashboard/teacher', { params }),
  GetTeacherById: (id) => api.get(`/dashboard/teacher/${id}`),
  CreateTeacher: (data) => api.post('/dashboard/teacher/create', data),
  UpdateTeacher: (id, data) => api.put(`/dashboard/teacher/update/${id}`, data),
  DeleteTeacher: (id) => api.delete(`/dashboard/teacher/delete/${id}`),
};

// ── Lần thi / Kết quả ──
// Backend chưa có API riêng cho attempts → dùng mock data
export const attemptService = {
  // Bắt đầu thi: tạm thời trả về mock
  start: async (examId) => ({
    attemptId: `attempt_${examId}_${Date.now()}`,
  }),

  // Nộp bài: tạm thời tính điểm ở frontend
  submit: async (attemptId, answers) => ({
    attemptId,
    answers,
  }),

  // Lấy kết quả
  getResult: async (attemptId) => {
    // Nếu backend chưa có endpoint, lấy từ sessionStorage
    const saved = sessionStorage.getItem(`result_${attemptId}`);
    if (saved) return JSON.parse(saved);
    throw new Error('Không tìm thấy kết quả');
  },

  // Lịch sử thi của tôi
  getMyHistory: async () => {
    const saved = sessionStorage.getItem('exam_history');
    return saved ? JSON.parse(saved) : [];
  },
};
