const db = require('../models/index.js');
// import jwt from "jsonwebtoken";
const bcrypt = require('bcrypt');

// const JWT_SECRET = process.env.JWT_SECRET;


// Register user
const Register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username)
    return res.status(400).json({ field: "username", message: "Tên đăng nhập không được để trống!" });

  if (!email)
    return res.status(400).json({ field: "email", message: "Email không được để trống!" }); 

  if (!password)
      return res.status(400).json({ field: "password", message: "Mật khẩu không được để trống!" });

  if (password.length < 6)
      return res.status(400).json({ field: "password", message: "Mật khẩu phải có ít nhất 6 ký tự!" });

  if (!confirmPassword)
      return res.status(400).json({ field: "confirmPassword", message: "Xác nhận mật khẩu không được để trống!" });

  if (password !== confirmPassword)
      return res.status(400).json({ field: "confirmPassword", message: "Nhập lại mật khẩu không khớp!" });

  const checkEmail = await db.User.findOne({ where: { email } });
  if (checkEmail)
    return res.status(400).json({ field: "email", message: "Email đã tồn tại!" });

  const checkUser = await db.User.findOne({ where: { username } });
  if (checkUser)
    return res.status(400).json({ field: "username", message: "Tài khoản đã tồn tại!" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const role = await db.Role.findOne({ where: { role: 'Student' } });

  const status = await db.Status.findOne({ where: { name: "Approved" } });

  const user = await db.User.create({ 
    username, 
    email, 
    password: hashedPassword,
    role_id: role.id,
    status_id: status.id
  });
    return res.status(201).json({ 
      message: 'Tạo user thành công!', 
      user: { id: user.id, username: user.username, email: user.email, role_id: user.role_id, status_id: user.status_id }, 
    });
}

module.exports = {
  Register
};
