const express = require('express');
const router = express.Router();

const {
  Register,
  Login,
  Me,
  ChangePassword,
  RefreshToken,
  Logout
} = require('../controllers/AuthController');

const Authentication = require('../middlewares/Authentication');

// đăng ký
router.post('/register', Register);

// đăng nhập
router.post('/login', Login);

// lấy user hiện tại
router.get('/me', Authentication, Me);

// đổi mật khẩu
router.put(
  '/change-password',
  Authentication,
  ChangePassword
);

// refresh token
router.post('/refresh-token', RefreshToken);

// logout
router.post('/logout', Authentication, Logout);

module.exports = router;