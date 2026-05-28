import api from './api';

export const authService = {
  login:    (username, password) => api.post('/api/login',    { username, password }),
  register: (data)               => api.post('/api/register', data),
  logout:   ()                   => api.post('/logout'),
};
