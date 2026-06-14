import axios from 'axios'

// baseURL để trống → Vite proxy tự chuyển sang http://localhost:3000
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // gửi cookie httpOnly
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // if (error.response?.status === 401) {
    //   // localStorage.removeItem('examflow_user')
    //   window.location.href = '/login'
    // }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error   ||
      error.message                 ||
      'Có lỗi xảy ra!'
    return Promise.reject(new Error(message))
  }
)

export default api
