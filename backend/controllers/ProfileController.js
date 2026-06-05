const db = require('../models/index.js');
const bcrypt = require("bcrypt");
// lấy thông tin profile
const GetProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Chưa đăng nhập!"
      });
    }

    const user = await db.User.findOne({
      where: { id: req.user.id },
      attributes: { 
        exclude: ["password", "refreshToken"]
      }
    });

    if (!user) {
      return res.status(404).json({ 
        message: "Không tìm thấy người dùng!" 
      });
    }

    return res.json({
      message: "Lấy thông tin người dùng thành công!",
      data: user
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }

};

// cập nhật profile (tạm thời bỏ)
// const UpdateProfile = async (req, res) => {
//   try {
//     const {
//       fullname,
//       username,
//       email,
//       phone,
//       address,
//       avatar
//     } = req.body;

//     const user = await db.User.findOne({
//       where: { id }
//     });

//     if (!user) {
//       return res.status(404).json({
//         message: "Không tìm thấy người dùng!"
//       });
//     }

//     await user.update({
//       fullname,
//       username,
//       email,
//       phone,
//       address,
//       avatar
//     });

//     return res.json({
//       message: 'Cập nhật profile thành công!',
//       data: user
//     });
//   } catch (err) {
//     return res.status(500).json({
//       error: err.message
//     });
//   }
// };

// đổi mật khẩu
const ChangePassword = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Chưa đăng nhập!"
      });
    }

    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin!"
      });
    }

    const user = await db.User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng!"
      });
    }

    const isOldPasswordValid = await bcrypt.compare(
      old_password,
      user.password
    );

    if (!isOldPasswordValid) {
      return res.status(400).json({
        message: "Mật khẩu cũ không đúng!"
      });
    }

    const isSamePassword = await bcrypt.compare(
      new_password,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message: "Mật khẩu mới phải khác mật khẩu cũ!"
      });
    }

    const hashPassword = await bcrypt.hash(new_password,10);

    await user.update({
      password: hashPassword,
      refreshToken: null
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại!"
    });

  } catch (err) {
    console.error("ChangePassword Error:", err);
    return res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  GetProfile,
  ChangePassword,
};