// src/services/authService.js
// Endpoint: POST /login, POST /register, POST /logout

import api from './api';

export const authService = {
  // POST /login — body: { username, password }
  // Response: { message, user: { id, username, email, role_id, role_name }, accessToken, refreshToken }
  login: (username, password) =>
    api.post('/login', { username, password }),

  // POST /register — body: { username, email, password, confirmPassword, role }
  // Response: { message, user: { id, username, email, role_id, status_id } }
  register: (data) =>
    api.post('/register', data),

  // POST /logout
  logout: () =>
    api.post('/logout'),
};
