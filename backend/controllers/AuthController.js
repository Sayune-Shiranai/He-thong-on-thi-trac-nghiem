const db = require('../models/index.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// đăng ký
const Register = async (req, res) => {
  try {
    const {
      fullname,
      username,
      email,
      password
    } = req.body;

    if (!fullname) {
      return res.status(400).json({
        error: 'Vui lòng nhập fullname!'
      });
    }

    if (!username) {
      return res.status(400).json({
        error: 'Vui lòng nhập username!'
      });
    }

    if (!email) {
      return res.status(400).json({
        error: 'Vui lòng nhập email!'
      });
    }

    if (!password) {
      return res.status(400).json({
        error: 'Vui lòng nhập password!'
      });
    }

    const checkUser = await db.User.findOne({
      where: {
        [Op.or]: [
          { email },
          { username }
        ]
      }
    });

    if (checkUser) {
      return res.status(400).json({
        error: 'Email hoặc username đã tồn tại!'
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(
      password,
      salt
    );

    const newUser = await db.User.create({
      fullname,
      username,
      email,
      password: hashPassword,
      role_id: 2
    });

    return res.status(201).json({
      message: 'Đăng ký thành công!',
      data: newUser
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// đăng nhập
const Login = async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body;

    if (!username) {
      return res.status(400).json({
        error: 'Vui lòng nhập username!'
      });
    }

    if (!password) {
      return res.status(400).json({
        error: 'Vui lòng nhập password!'
      });
    }

    const user = await db.User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email: username }
        ]
      },
      include: [
        {
          model: db.Role
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        error: 'Tài khoản không tồn tại!'
      });
    }

    const checkPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!checkPassword) {
      return res.status(400).json({
        error: 'Sai mật khẩu!'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    return res.json({
      message: 'Đăng nhập thành công!',
      token,
      user
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// lấy thông tin user hiện tại
const Me = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await db.User.findOne({
      where: { id },
      include: [
        {
          model: db.Role
        }
      ],
      attributes: {
        exclude: ['password']
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Không tìm thấy user!'
      });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// đổi mật khẩu
const ChangePassword = async (req, res) => {
  try {
    const { id } = req.user;

    const {
      old_password,
      new_password
    } = req.body;

    if (!old_password) {
      return res.status(400).json({
        error: 'Vui lòng nhập mật khẩu cũ!'
      });
    }

    if (!new_password) {
      return res.status(400).json({
        error: 'Vui lòng nhập mật khẩu mới!'
      });
    }

    const user = await db.User.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Không tìm thấy user!'
      });
    }

    const checkPassword = await bcrypt.compare(
      old_password,
      user.password
    );

    if (!checkPassword) {
      return res.status(400).json({
        error: 'Mật khẩu cũ không đúng!'
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(
      new_password,
      salt
    );

    await user.update({
      password: hashPassword
    });

    return res.json({
      message: 'Đổi mật khẩu thành công!'
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// refresh token
const RefreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token không hợp lệ!'
      });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            error: 'Token hết hạn!'
          });
        }

        const newToken = jwt.sign(
          {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            role_id: decoded.role_id
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '7d'
          }
        );

        return res.json({
          token: newToken
        });
      }
    );
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// logout
const Logout = async (req, res) => {
  try {
    return res.json({
      message: 'Đăng xuất thành công!'
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  Register,
  Login,
  Me,
  ChangePassword,
  RefreshToken,
  Logout
};