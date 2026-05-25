const db = require('../models/index.js');
const bcrypt = require('bcryptjs');

// lấy thông tin profile
const GetProfile = async (req, res) => {
  try {
    const { id } = req.params;

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
        error: 'Không tìm thấy người dùng!'
      });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// cập nhật profile
const UpdateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullname,
      username,
      email,
      phone,
      address,
      avatar
    } = req.body;

    const user = await db.User.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Không tìm thấy người dùng!'
      });
    }

    await user.update({
      fullname,
      username,
      email,
      phone,
      address,
      avatar
    });

    return res.json({
      message: 'Cập nhật profile thành công!',
      data: user
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

// đổi mật khẩu
const ChangePassword = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      old_password,
      new_password
    } = req.body;

    const user = await db.User.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Không tìm thấy người dùng!'
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

// upload avatar
const UploadAvatar = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.User.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Không tìm thấy người dùng!'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'Vui lòng chọn ảnh!'
      });
    }

    const avatar = `/uploads/avatar/${req.file.filename}`;

    await user.update({
      avatar
    });

    return res.json({
      message: 'Upload avatar thành công!',
      avatar
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  GetProfile,
  UpdateProfile,
  ChangePassword,
  UploadAvatar
};