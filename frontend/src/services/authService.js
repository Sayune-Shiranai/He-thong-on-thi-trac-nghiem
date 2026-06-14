import api from './api';

export const authService = {
  profile:  ()                   => api.get('/profile'),
  login:    (username, password) => api.post('/login',    { username, password }),
  register: (data)               => api.post('/register', data),
  logout:   ()                   => api.post('/logout'),
};
